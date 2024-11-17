import FormData from 'form-data';

import * as FileUploadApiServices from '../api/fileUploadApi.service';
import * as LogoApiServices from '../api/sportsLogoApi.services';

import { defineKinds } from '../../data-access/utils';
import { addSportsLogos } from "../../data-access/sportsLogo";
import { getUnregisteredLogoIdList } from "../../data-access/sportsLogo";

import { sleep } from "../../utils/library";
import { convertSportsLogoFile, getSportsLogoParam, validateSportsType } from "./utils";

const MAX_NUMBER = 50;

interface TLogoData {
	id: number
	base64: string
}

interface TFileUploadResponse {
	id: string
	path: string
}

interface TLogoURL {
	id: string
	sportsName: string
	category: string
	path: string
}

const uploadData = async (data: any, sportsName: string, category: string) => {
	try {
		const loopCount = Math.ceil(data.length / MAX_NUMBER);

		let logoUrls = [] as TFileUploadResponse[];

		for (let i = 0; i < loopCount; i++) {
			const firstElement = i * MAX_NUMBER;
			const endElement = firstElement + MAX_NUMBER;

			const logos = await LogoApiServices.getLogoData(
				getSportsLogoParam(sportsName), 
				category, 
				data.slice(firstElement, endElement)
			) as TLogoData[];

			const formData = new FormData();

			logos.map((logo: TLogoData) => {
				const imageBlob = convertSportsLogoFile(logo.base64);

				formData.append('images', imageBlob, {
					filename: `${logo.id}.png`,
				});
			});

			if (logos.length > 0) {
				const resData = await FileUploadApiServices.fileUpload(formData) as TFileUploadResponse[];
				logoUrls = [...logoUrls, ...resData];
			}

			await sleep(1000);
		}

		return logoUrls;
	} catch (err) {
		console.error(err);
		return [];
	}
}

export const updateSportsLogo = async (sportsName: string, DBModel: any) => {
	try {
		if (!validateSportsType(sportsName)) {
			return;
		}

		const { category } = defineKinds(sportsName);
		const idData = await getUnregisteredLogoIdList(sportsName, DBModel) as any;

		const leagueIds = idData[0].league_ids;
		const teamIds = idData[0].team_ids;

		let logoUrls = [] as TLogoURL[];

		if (leagueIds.length > 0) {
			const leagueLogos = await uploadData(leagueIds, sportsName, 'leagues');

			const _logoUrls = leagueLogos.map((leagueLogo) => {
				return {
					...leagueLogo,
					sportsName: sportsName,
					category: 'leagues'
				}
			});

			logoUrls = [...logoUrls, ..._logoUrls];
		}
		if (teamIds.length > 0) {
			const teamLogos = await uploadData(teamIds, sportsName, category);

			const _logoUrls = teamLogos.map((teamLogo) => {
				return {
					...teamLogo,
					sportsName: sportsName,
					category: category
				}
			});

			logoUrls = [...logoUrls, ..._logoUrls];
		}

		await addSportsLogos(logoUrls);
	} catch (err) {
		console.error(err);
	}
}