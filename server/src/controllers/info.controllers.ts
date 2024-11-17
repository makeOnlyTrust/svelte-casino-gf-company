import { Request, Response } from 'express';

// Config
import * as response from '../config/response';

// Model
import Customer from '../models/customer.model';
import MinigameBetting from "../models/minigameBetting.model";
import CasinoBetting from "../models/casinoBetting.model";

// Services
import { ObjectId } from "mongodb";
import { JwtGaurdRequest } from "../middlewares/account.middlewares";

export const getTotalWin = async (req: JwtGaurdRequest, res: Response) => {
    let userId: any = req.userId;
    try {
        const user = await Customer.findOne(
            {
                _id: new ObjectId(userId)
            }
        )

        if (!user || !user.nickname || !user._id) {
            res.status(400).json(response.getTypesFailed);
            return;
        }

        const casinoBet = await CasinoBetting.find(
            {
                "transaction.type": "win",
                username: user._id,
                amount: {
                    $not: {
                        $eq: 0
                    }
                }
            }
        );
        const casinoWin = casinoBet.length;

        const minigameBet = await MinigameBetting.find(
            {
                "transactions.txType": "win",
                customerId: user._id,
                amount: {
                    $not: {
                        $eq: 0
                    }
                }
            }
        )
        const miniWin = minigameBet.length;
        res.status(200).json({
            count: casinoWin + miniWin
        });
    } catch (e) {
        res.status(400).json(response.getTypesFailed);
    }
};

export const getTotalBet = async (req: JwtGaurdRequest, res: Response) => {
    let userId: any = req.userId;
    try {
        const user = await Customer.findOne(
            {
                _id: new ObjectId(userId)
            }
        )
        if (!user) {
            res.status(400).json(response.getTypesFailed);
            return;
        }
        const casinoBet = await CasinoBetting.find(
            {
                "transaction.type": "bet",
                username: user._id
            }
        )

        const casinoBetCount = casinoBet.length;

        const minigameBet = await MinigameBetting.find(
            {
                "transactions.txType": "bet",
                customerId: user._id
            }
        )
        const minigameBetCount = minigameBet.length;
        res.status(200).json({
            count: casinoBetCount + minigameBetCount
        });

    } catch {
        res.status(400).json(response.getTypesFailed);
    }
}

export const getTotalWagered = async (req: JwtGaurdRequest, res: Response) => {
    let userId: any = req.userId;
    try {
        const user = await Customer.findOne(
            {
                _id: new ObjectId(userId)
            }
        )
        if (!user) {
            res.status(400).json(response.getTypesFailed);
            return;
        }

        const casinoBet = await CasinoBetting.aggregate([
            {
                $match: {
                    "transaction.type": "bet",
                    username: user._id,
                    amount: {
                        $not: {
                            $eq: 0
                        }
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' }
                }
            },
        ]);
        const casinoBetWagered = casinoBet[0]?.totalAmount ?? 0;

        const minigameBet = await MinigameBetting.aggregate([
            {
                $match: {
                    "transactions.txType": "bet",
                    customerId: user._id,
                    amount: {
                        $not: {
                            $eq: 0
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'currencies',
                    localField: 'currencyId',
                    foreignField: '_id',
                    as: 'currency'
                }
            },
            {
                $unwind: '$currency'
            },
            {
                $lookup: {
                    from: 'cryptorates',
                    localField: 'currency.currencySymbol',
                    foreignField: 'symbol',
                    as: 'cryptorates'
                }
            },
            {
                $unwind: '$cryptorates'
            },
            {
                $addFields: {
                    rate: '$cryptorates.krw',
                    amount: '$amount',
                    transAmount: {
                        $multiply: [
                            { "$ifNull": ["$cryptorates.krw", 0] },
                            { "$ifNull": ["$amount", 0] }
                        ]
                    },
                    result: '$cryptorates.krw' + '$amount'
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$transAmount' }
                }
            },
        ])
        const minigameBetWagered = minigameBet[0]?.totalAmount ?? 0;

        res.status(200).json({
            total: Math.abs(casinoBetWagered + minigameBetWagered)
        });

    } catch {
        res.status(400).json(response.getTypesFailed);
    }
}

export const getTop3Game = async (req: JwtGaurdRequest, res: Response) => {
    let userId: any = req.userId;
    try {
        const user = await Customer.findOne(
            {
                _id: new ObjectId(userId)
            }
        )
        if (!user) {
            res.status(400).json(response.getTypesFailed);
            return;
        }
        const Top = await MinigameBetting.aggregate([
            {
                $match:{
                    "transactions.txType": "bet",
                    customerId: user._id,
                },
            },
            {
                $group:{
                    _id: '$details.gameId',
                    matches_count: { $sum: 1 }
                }
            },
            {
                $addFields: {
                    cate : 'minigame',
                }
            },
            {
                $lookup: {
                    from: 'minigamelists',
                    localField: '_id',
                    foreignField: 'gameId',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                category: 1,
                                thumbnail: 1,
                            }
                        }
                    ],
                    as: 'minigamelists'
                },
            },
            {
                $unwind: '$minigamelists'
            },
            {
                $addFields: {
                    type: '$minigamelists.category',
                    gameId: '$minigamelists._id',
                    thumbnail: '$minigamelists.thumbnail',
                }
            },
            {
                $project: {
                    minigamelists: 0
                }
            },
            {
                $unionWith: {
                    coll: "casinobettings",
                    pipeline: [
                        {
                            $match:{
                                "transaction.type": "bet",
                                username: user._id
                            }
                        },
                        {
                            $group:{
                                _id: '$transaction.details.game.id',
                                matches_count: { $sum: 1 }
                            }
                        },
                        {
                            $addFields: {
                                cate : 'casino',
                            }
                        },
                        {
                            $lookup: {
                                from: 'casinolists',
                                localField: '_id',
                                foreignField: 'id',
                                pipeline: [
                                    {
                                        $project: {
                                            _id: 1,
                                            title: 1,
                                            thumbnail: 1
                                        }
                                    }
                                ],
                                as: 'casinolists'
                            },
                        },
                        {
                            $unwind: '$casinolists'
                        },
                        {
                            $addFields: {
                                type:
                                    {
                                        $replaceAll: {
                                            input: {
                                                $toLower: '$casinolists.title'
                                            },
                                            find: ' ',
                                            replacement: '-'
                                        }

                                    },
                                gameId: '$casinolists._id',
                                thumbnail: '$casinolists.thumbnail',
                            }
                        },
                        {
                            $project: {
                                casinolists: 0,
                            }
                        }
                    ]
                }
            },
            {
                $sort:{
                    matches_count:-1
                }
            }
        ]);

        res.status(200).json({
            top: Top
        });

    } catch {
        res.status(400).json(response.getTypesFailed);
    }
}
