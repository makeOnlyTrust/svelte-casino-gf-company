import { ObjectId } from 'mongodb';

import SportsMainOddNamesModel from "../models/sports/sportsMainOddNames.model";

export const getAllData = async () => {
    try {
        const mainOddNames = await SportsMainOddNamesModel.find({});

        return mainOddNames;
    } catch (err) {
        console.error(err);
        return [];
    }
}

export const getData = async (sportsName: string, type: string) => {
    try {
        const mainOddName = await SportsMainOddNamesModel.findOne({
           sportsName: sportsName,
           type: type
        });

        return mainOddName;
    } catch (err) {
        console.error(err);

        return {};
    }
}

export const getDataById = async (id: string) => {
    try {
        const mainOddName = await SportsMainOddNamesModel.findById(id);

        return mainOddName;
    } catch (err) {
        console.error(err);

        return {};
    }
}

export const addData = async (sportsName: string, type: string, odd1: string, odd2: string, odd3: string) => {
    try {
        const newMainOddName = new SportsMainOddNamesModel({
            sportsName,
            type,
            odd1,
            odd2,
            odd3
        });
        await newMainOddName.save();
        
        return 'success';
    } catch (err) {
        console.error(err);
        return 'fail';
    }
}

export const updateData = async (id: string, odd1: string, odd2: string, odd3: string) => {
    try {
        await SportsMainOddNamesModel.updateOne(
            {
                _id: new ObjectId(id)
            },
            {
                $set: {
                    odd1: odd1,
                    odd2: odd2,
                    odd3: odd3
                }
            }
        );

        return 'success';
    } catch(err) {
        console.error(err);
        return 'fail';
    }
}