import { Request, Response } from 'express';

import {
    getAllData,
    getData,
    getDataById,
    updateData,
    addData
} from '../data-access/sportsMainLeagues';

// Config
import * as response from '../config/response';

export const getAllMainLeagueId = async (req: Request, res: Response) => {
    try {
        const resData = await getAllData();
        res.status(200).json(resData);
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
}

export const getMainLeagueId = async (req: Request, res: Response) => {
    try {
        const { sportsName, type } = req.body;
        const resData = await getData(sportsName, type);
        res.status(200).json(resData);
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
}

export const getMainLeagueIdById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const resData = await getDataById(id);
        res.status(200).json(resData);
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
}

export const addMainLeagueId = async (req: Request, res: Response) => {
    try {
        const { sportsName, type, leagueId } = req.body;
        const leagueData = await getData(sportsName, type);
        if(leagueData) {
            res.status(200).json(leagueData);
        } else {
            const resData = await addData(sportsName, type, leagueId);
            res.status(200).json(resData);
        }
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
}

export const updateMainLeagueId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { leagueId } = req.body;

        const resData = await updateData(id, leagueId);
        res.status(200).json(resData);
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
}