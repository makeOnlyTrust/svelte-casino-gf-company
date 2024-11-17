import { Request, Response } from 'express';
import * as response from '../config/response';
import MinigameResult from '../models/minigameResult.model';
import MinigameList from "../models/minigameList.model";
import MinigameBetting from "../models/minigameBetting.model";
import { ObjectId } from "mongodb";
import { updateWallet } from "../services/wallet.services";
import Customer from "../models/customer.model";
import Wallet from "../models/wallet.model";
import { getMinigameMultiplier } from "../services/minigame/multiplier.services";
import { getMinigameIndex } from "../services/minigame";
import { JwtGaurdRequest } from "../middlewares/account.middlewares";
import MinigameActive from "../models/minigameActive.model";

export const getGameList = async (req: Request, res: Response) => {
    const userId: any = req.query.userId;
    const type: any = req.query.type;
    const vendor: any = req.query.vendor;
    try {
        const pipeline = [];
        if (type && type !== '') {
            pipeline.push({
                $match: {
                    category: type
                }
            });
        }
        if (vendor && vendor !== '') {
            pipeline.push({
                $match: {
                    vendor: vendor
                }
            });
        }

        pipeline.push(
            {
                $lookup: {
                    from: 'minigameactives',
                    localField: 'gameId',
                    foreignField: 'gameId',
                    as: 'minigameactives',
                }
            },
            {
                $unwind: '$minigameactives'
            },
            {
                $match: {
                    'minigameactives.status': true
                }
            },
            {
                $lookup: {
                    from: 'favorites',
                    localField: 'gameId',
                    foreignField: 'gameId',
                    as: 'favorites',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'customers',
                                localField: 'customerId',
                                foreignField: '_id',
                                as: 'customers'
                            }
                        },
                        {
                            $unwind: '$customers'
                        },
                        {
                            $match: {
                                'customers._id': new ObjectId(userId ? userId : 1)
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: '$favorites',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    favorites: {
                        $cond: {
                            if: { $eq: [{ $type: '$favorites' }, 'object'] },
                            then: true,
                            else: false
                        }
                    }
                }
            });
        const minigameList: any = await MinigameList.aggregate(pipeline);
        // const minigameList: any = await MinigameList.find({});
        res.status(200).json(minigameList);
    } catch {
        res.status(400).json(response.ApiFailed);
    }
};

export const getGameInfo = async (req: Request, res: Response) => {
    const idx: any = req.query.idx;
    const userId: any = req.query.userId;
    try {
        const minigameInfo: any = (await MinigameList.aggregate([
            {
                $match: {
                    _id: new ObjectId(idx)
                }
            },
            {
                $lookup: {
                    from: 'favorites',
                    localField: 'gameId',
                    foreignField: 'gameId',
                    as: 'favorites',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'customers',
                                localField: 'customerId',
                                foreignField: '_id',
                                as: 'customers'
                            }
                        },
                        {
                            $unwind: '$customers'
                        },
                        {
                            $match: {
                                'customers._id': new ObjectId(userId ? userId : 1)
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: '$favorites',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    isFavorite: {
                        $cond: {
                            if: { $eq: [{ $type: '$favorites' }, 'object'] },
                            then: true,
                            else: false
                        }
                    }
                }
            }
        ]))[0];
        // const minigameInfo: any = await MinigameList.findOne({ _id: idx });
        res.status(200).json(minigameInfo);
    } catch {
        res.status(400).json(response.ApiFailed);
    }
};

export const getMinigameVendorList = async (req: Request, res: Response) => {
    try {
        const minigameVendorList: any = await MinigameList.distinct('vendor');
        res.status(200).json(minigameVendorList);
    } catch {
        res.status(400).json(response.ApiFailed);
    }
};

export const getGameResult = async (req: Request, res: Response) => {
    const vendor = req.query.vendor;
    const gameId = req.query.gameId;
    const index = req.query.index;
    try {
        const minigameResult: any = await MinigameResult.findOne(
            {
                vendor,
                gameId,
            },
            {},
            {
                limit: 1,
                skip: 0,
                sort: {
                    _id: -1
                }
            }
        );
        res.status(200).json(minigameResult);
    } catch {
        res.status(400).json(response.ApiFailed);
    }
};

export const getGameResultList = async (req: Request, res: Response) => {
    const vendor = req.query.vendor;
    const date = req.query.date;
    const time = req.query.time;
    const gameId = req.query.gameId;
    const index = req.query.index;
    console.log(
        vendor,
        date,
        time,
        gameId
    )
    try {
        const minigameResultList: any = await MinigameResult.find(
            {
                vendor,
                date: {
                    $gte: date
                },
                time: {
                    $gte: time
                },
                gameId,
            },
            {},
            {
                limit: 10,
                skip: 0,
                sort: {
                    _id: -1
                }
            }
        );
        res.status(200).json(minigameResultList);
    } catch {
        res.status(400).json(response.ApiFailed);
    }
};

export const postMinigameBet = async (req: JwtGaurdRequest, res: Response) => {
    const adminId = req.adminId;
    const {
        userId,
        gameId,
        amount,
        refererId,
        bet
    } = req.body;
    try {
        const isActive = await MinigameActive.findOne(
            {
                adminId: new ObjectId(adminId),
                gameId
            }
        )
        if (!isActive || !isActive.startAt || !isActive.endAt) {
            res.status(400).json(response.getTypesFailed);
            return;
        }
        if (isActive.status === false) {
            res.status(400).json(response.minigameClosed);
            return;
        }

        const date = new Date();
        const _t = date.toISOString().split('T')[1].split('.')[0]
        if (!(isActive?.startAt < _t && _t < isActive?.endAt)) {
            res.status(400).json(response.minigameClosed);
            return;
        }

        const user: any = await Customer.findOne({ _id: new ObjectId(userId ? userId : 1) });

        if (!user) {
            res.status(400).json(response.emailInvalid);
            return;
        }
        const minigame = await MinigameList.findOne({ gameId });
        if (!minigame) {
            res.status(400).json(response.getTypesFailed);
            return;
        }
        const minigameIndex = getMinigameIndex(date, Number(minigame.interval));
        const isAlreadyBettingInSameGame = await MinigameBetting.find({
            isChecked: false,
            "details.gameId": gameId,
            "details.index": minigameIndex,
        });

        if (isAlreadyBettingInSameGame.length > 0) {
            res.status(400).json(response.alreadyBettingInSameMinigame);
            return;
        }
        const customerId = user._id;
        const wallet = await Wallet.findOne({
            _id: user.walletId
        })
        if (!wallet || !wallet.casino) {
            res.status(400).json(response.getWalletFailed);
            return;
        }
        const currencyId = wallet.casino.currencyId;

        const game = await MinigameList.findOne({
            gameId
        })
        if (!game) {
            res.status(400).json(response.ApiFailed);
            return;
        }

        const multiplier = getMinigameMultiplier({
            bet,
            gameId,
            category: game.category
        });

        if (multiplier === 0) {
            res.status(400).json(response.getTypesFailed);
            return;
        }

        const success = await updateWallet(userId, -amount, currencyId.toString());
        if (success === "success") {

        } else if (success === "nomoney") {
            res.status(400).json(response.notEnoughBalance);
            return;
        } else {
            res.status(400).json(response.ApiFailed);
            return;
        }

        const bettingList = await MinigameBetting.create({
            customerId: customerId,
            currencyId: currencyId,
            amount: -amount,
            isChecked: false,
            checkedId: null,
            transactions: {
                id: date.getTime(), // timestamp
                txType: "bet", // “bet”, “win”
                refererId: refererId,
                amount: amount,
                processedAt: date.toISOString(),
            },
            details: {
                gameId: gameId,
                index: minigameIndex,
                bet: bet,
                amount: amount,
                multiplier: multiplier
            }
        })
        res.status(200).json({ msg: bettingList });
    } catch (e) {
        res.status(400).json(response.ApiFailed);
    }
};

export const getBetRate = async (req: Request, res: Response) => {
    const {
        gameId,
        bet
    } = req.body;
    try {
        const game = await MinigameList.findOne({
            gameId
        })
        if (!game) {
            res.status(400).json(response.ApiFailed);
            return;
        }

        const multiplier = getMinigameMultiplier({
            bet,
            gameId,
            category: game.category
        });
        if (multiplier === 0) {
            res.status(400).json(response.getTypesFailed);
            return;
        }

        res.status(200).json(multiplier);
    } catch (e) {
        res.status(400).json(response.ApiFailed);
    }
};
export const getBetHistoryList = async (req: Request, res: Response) => {
    try {
        const minigameBettingHistoryList: any = await MinigameBetting.aggregate([
            {
                $match: {
                    // customerId: user._id,
                    "transactions.txType": "win"
                }
            },
            {
                $lookup: {
                    from: 'minigamelists',
                    localField: 'details.gameId',
                    foreignField: 'gameId',
                    as: 'minigamelists',
                }
            },
            {
                $unwind: '$minigamelists'
            },
            {
                $lookup: {
                    from: 'currencies',
                    localField: 'currencyId',
                    foreignField: '_id',
                    as: 'currencies',
                }
            },
            {
                $unwind: '$currencies'
            },
            {
                $lookup: {
                    from: 'customers',
                    localField: 'customerId',
                    foreignField: '_id',
                    as: 'customers',
                }
            },
            {
                $unwind: '$customers'
            },
            {
                $sort: {
                    _id: -1,
                }
            },
            {
                $limit: 10,
            },
            {
                $skip: 0,
            },
        ]);
        res.status(200).json(minigameBettingHistoryList);
    } catch {
        res.status(400).json(response.ApiFailed);
    }
};
