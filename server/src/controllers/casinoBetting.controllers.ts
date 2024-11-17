import { Request, Response } from 'express';

// Config
import * as response from '../config/response';

// Model
import CasinoBetting from '../models/casinoBetting.model';

export const getCasinoBettingList = async (req: Request, res: Response) => {
    try {
        const betList: any = await CasinoBetting.aggregate([
            {
                $match: {
                    'transaction.type': 'win'
                }
            },
            {
                $lookup: {
                    from: 'casinobettings',
                    localField: 'transaction.referer_id',
                    foreignField: 'transaction.id',
                    as: 'casinobettings'
                }
            },
            {
                $unwind: '$casinobettings'
            },
            {
                $lookup: {
                    from: 'customers',
                    localField: 'username',
                    foreignField: '_id',
                    as: 'customer'
                }
            },
            {
                $unwind: '$customer'
            },
            {
                $sort: {
                    'transaction.processed_at': -1
                }
            },
            {
                $limit: 10
            }
        ]);

        let list = betList.map((item: any) => {
            return {
                title: item.transaction.details.game.title,
                nickname: item.customer.nickname,
                betAmount: Math.abs(item.casinobettings.amount),
                profitAmount: item.amount
            };
        });
        res.status(200).json({ betList: list });
    } catch {
        res.status(400).json(response.ApiFailed);
    }
};
