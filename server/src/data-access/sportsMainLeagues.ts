import { ObjectId } from 'mongodb';

import SportsMainLeagueModel from "../models/sports/sportsMainLeagues.model";

export const getAllData = async () => {
    try {
        const mainLeagueIdArray = await SportsMainLeagueModel.find({});

        return mainLeagueIdArray;
    } catch (err) {
        console.error(err);
        return [];
    }
}

export const getData = async (sportsName: string, type: string) => {
    try {
        const mainLeagueIdData = await SportsMainLeagueModel.findOne({
           sportsName: sportsName,
           type: type
        });

        return mainLeagueIdData;
    } catch (err) {
        console.error(err);

        return {};
    }
}

export const getDataById = async (id: string) => {
    try {
        const mainLeagueIdData = await SportsMainLeagueModel.findById(id);

        return mainLeagueIdData;
    } catch (err) {
        console.error(err);

        return {};
    }
}

export const addData = async (sportsName: string, type: string, leagueId: string) => {
    try {
        const newMainLeague = new SportsMainLeagueModel({
            sportsName,
            type,
            leagueId
        });
        await newMainLeague.save();
        
        return 'success';
    } catch (err) {
        console.error(err);
        return 'fail';
    }
}

export const updateData = async (id: string, leagueId: string) => {
    try {
        await SportsMainLeagueModel.updateOne(
            {
                _id: new ObjectId(id)
            },
            {
                $set: {
                    leagueId: leagueId
                }
            }
        );

        return 'success';
    } catch(err) {
        console.error(err);
        return 'fail';
    }
}