import {Response} from 'express';
import {JwtGaurdRequest} from "../middlewares/account.middlewares";
import * as response from '../config/response';
import {ObjectId} from "mongodb";
import Promotion from "../models/promotion";

export const promotionList = async (req: JwtGaurdRequest, res: Response) => {
    const adminId = req.clientAdminId;
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    try {
        const list = await Promotion.find(
            {
                adminId: new ObjectId(adminId),
                endAt: {
                    $gt: formattedDate
                },
                isDelete: false
            },
        )

        if (list.length > 0) {
            res.status(200).json(
                list
            );
        } else {
            res.status(200).json(
                []
            );
        }
    } catch {
        res.status(400).json(response.getTypesFailed);
    }
};

export const promotionCloseList = async (req: JwtGaurdRequest, res: Response) => {
    const adminId = req.clientAdminId;
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    try {
        const list = await Promotion.find(
            {
                adminId: new ObjectId(adminId),
                endAt: {
                    $lte: formattedDate
                },
                isDelete: false
            },
        )
        if (list.length > 0) {
            res.status(200).json(
                list
            );
        } else {
            res.status(200).json(
                []
            );
        }
    } catch {
        res.status(400).json(response.getTypesFailed);
    }
};

export const promotionDetail = async (req: JwtGaurdRequest, res: Response) => {
    const adminId = req.clientAdminId;
    const {id} = req.body;
    try {
        const list = await Promotion.findOne(
            {
                adminId: new ObjectId(adminId),
                _id: new ObjectId(id),
            },
        )
        if (list) {
            res.status(200).json(
                list
            );
        } else {
            res.status(400).json(response.getTypesFailed);
        }
    } catch {
        res.status(400).json(response.getTypesFailed);
    }
};
