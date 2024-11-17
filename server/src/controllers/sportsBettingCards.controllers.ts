import { Request, Response } from 'express';

import {
    getAllData,
    getData,
    getDataById,
    addData,
    getDataByType
} from '../data-access/sportsBettingCards';

// Config
import * as response from '../config/response';

export const getAllBettingCards = async (req: Request, res: Response) => {
    try {
        const resData = await getAllData();
        res.status(200).json(resData);
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
}

export const getBettingCards = async (req: Request, res: Response) => {
    try {
        const { customerId } = req.body;
        const resData = await getData(customerId);
        res.status(200).json(resData);
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
}

export const getBettingCardById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const resData = await getDataById(id);
        res.status(200).json(resData);
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
}

export const getBettingCardByType = async (req: Request, res: Response) => {
    try {
        const { customerId, bettingType } = req.body;
        const resData = await getDataByType(customerId, bettingType);
        res.status(200).json(resData);
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
}

export const addSingleBettingCards = async (req: Request, res: Response) => {
    try {
        const {
            customerId,
            bettingCards
        } = req.body;

        const insertData = [] as any;

        bettingCards.map((ele: any) => {
            insertData.push({
                customerId: customerId,
                bettingType: 'single',
                bet: [{
                    sportsName: ele.sportsName,
                    matchId: ele.matchId,
                    leagueId: ele.leagueId,
                    matchA: ele.matchA,
                    matchB: ele.matchB,
                    oddId: ele.oddId,
                    oddName: ele.oddName,
                    subOddName: ele.subOddName,
                    oddTarget: ele.oddTarget,
                    oddValue: ele.oddValue
                }],
                bettingAmount: ele.bettingAmount,
                isCompleted: false
            })
        })
        const resData = await addData(insertData);
        res.status(200).json(resData);
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
}

export const addMultipleBettingCards = async (req: Request, res: Response) => {
    try {
        const {
            customerId,
            bettingCards,
            bettingAmount
        } = req.body;

        const bets = [] as any;

        bettingCards.map((ele: any) => {
            bets.push({
                sportsName: ele.sportsName,
                matchId: ele.matchId,
                leagueId: ele.leagueId,
                matchA: ele.matchA,
                matchB: ele.matchB,
                oddId: ele.oddId,
                oddName: ele.oddName,
                subOddName: ele.subOddName,
                oddTarget: ele.oddTarget,
                oddValue: ele.oddValue
            })
        })

        const resData = await addData([{
            customerId: customerId,
            bettingType: 'multiple',
            bet: bets,
            bettingAmount: bettingAmount,
            isCompleted: false
        }]);
        
        res.status(200).json(resData);
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
}