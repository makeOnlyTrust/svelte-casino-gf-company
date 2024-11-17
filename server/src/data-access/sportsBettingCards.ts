import { ObjectId } from 'mongodb';

import SportsBettingCardsModel from "../models/sports/sportsBettingCards.model";

export const getAllData = async () => {
    try {
        const bettingData = await SportsBettingCardsModel.find({});

        return bettingData;
    } catch (err) {
        console.error(err);
        return [];
    }
}

export const getData = async (customerId: string) => {
    try {
        const bettingData = await SportsBettingCardsModel.find({
            customerId
        });

        return bettingData;
    } catch (err) {
        console.error(err);

        return {};
    }
}

export const getDataByType = async (customerId: string, bettingType: string ) => {
    try {
        const bettingData = await SportsBettingCardsModel.find({
            customerId,
            bettingType
        });

        return bettingData;
    } catch (err) {
        console.error(err);

        return {};
    }
}

export const getDataById = async (id: string) => {
    try {
        const bettingData = await SportsBettingCardsModel.findOne({
            _id: new ObjectId(id)
        });

        return bettingData;
    } catch (err) {
        console.error(err);

        return {};
    }
}

export const addData = async (bettingCards: any) => {
    try {
        await SportsBettingCardsModel.insertMany(bettingCards);

        return 'success';
    } catch (err) {
        console.error(err);
        return 'fail';
    }
}

export const updateData = async (
    id: string,
    isWin: string,
    times: number
) => {
    try {
        await SportsBettingCardsModel.updateOne(
            {
                _id: new ObjectId(id)
            },
            {
                $set: {
                    isWin: isWin,
                    times: times,
                    isCompleted: true
                }
            }
        );

        return 'success';
    } catch (err) {
        console.error(err);
        return 'fail';
    }
}