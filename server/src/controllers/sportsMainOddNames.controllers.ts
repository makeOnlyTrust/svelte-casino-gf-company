import { Request, Response } from 'express';

import {
    getAllData,
    getData,
    getDataById,
    updateData,
    addData
} from '../data-access/sportsMainOddNames';

// Config
import * as response from '../config/response';

export const getAllMainOddNames = async (req: Request, res: Response) => {
    try {
        const resData = await getAllData();
        res.status(200).json(resData);
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
}

export const getMainOddName = async (req: Request, res: Response) => {
    try {
        const { sportsName, type } = req.body;
        const resData = await getData(sportsName, type);
        res.status(200).json(resData);
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
}

export const getMainOddNameById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const resData = await getDataById(id);
        res.status(200).json(resData);
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
}

export const addMainOddName = async (req: Request, res: Response) => {
    try {
        const { sportsName, type, odd1, odd2, odd3 } = req.body;
        const leagueData = await getData(sportsName, type);
        if(leagueData) {
            res.status(200).json(leagueData);
        } else {
            const resData = await addData(sportsName, type, odd1, odd2, odd3);
            res.status(200).json(resData);
        }
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
}

export const updateMainOddName = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { odd1, odd2, odd3 } = req.body;

        const resData = await updateData(id, odd1, odd2, odd3);
        res.status(200).json(resData);
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
}