import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import axios from 'axios';

// Config
import * as response from '../config/response';

// Utils
import { getSocketIO } from '../utils/socket';

// Model
import Wallet from '../models/wallet.model';
import Customer from '../models/customer.model';
import CasinoList from '../models/casinoList.model';
import CasinoBetting from '../models/casinoBetting.model';
import CasinoActive from "../models/casinoActive.model";

// create user
export const createUser = async (req: Request, res: Response) => {
    const userId: any = req.body.userId;
    const nickname: any = req.body.nickname;

    const endpoint: string = `https://api.honorlink.org/api/user/create`;
    const apiKey: string = process.env.HONORLINK_API_KEY!;

    const headers = {
        Authorization: `Bearer ${apiKey}`
    };

    const options = {
        headers: headers,
        withCredentials: true
    };

    try {
        const data = await axios.post(
            endpoint,
            {
                username: userId,
                nickname: nickname
            },
            options
        );

        res.status(200).json(data);
    } catch (error) {
        res.json({ code: 4000, message: 'error' });
    }
};

// list
export const getList = async (req: Request, res: Response) => {
    try {
        const title: any = req.query.title;
        const type: any = req.query.type;
        const vendor: any = req.query.vendor;
        let page: any = req.query.page;
        const sort: any = req.query.sort;
        let limit: any = req.query.limit;
        const userId: any = req.query.userId;

        limit = parseInt(limit);
        page = parseInt(page);

        const pipeline: any = [];

        // Match stage
        const matchStage: any = {};
        if (title && title !== '') {
            matchStage.title = { $regex: new RegExp(title, 'i') };
        }
        if (type && type !== '') {
            matchStage.type = { $eq: type };
        }
        if (vendor && vendor !== '') {
            matchStage.vendor = { $eq: vendor };
        }
        pipeline.push({ $match: matchStage });

        // Add Field
        pipeline.push({
            $addFields: {
                rank: {
                    $ifNull: ['$rank', 9999]
                }
            }
        });

        // favorite
        pipeline.push(
            {
                $lookup: {
                    from: 'favorites',
                    localField: 'id',
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
            }
        );

        // Sort stage
        let facetData = [],
            sortStage;
        if (sort && sort === 'rank') {
            sortStage = { rank: 1 };
            facetData.push({ $sort: sortStage });
        }

        // Skip && Limit
        facetData.push({ $skip: page * limit }, { $limit: limit });

        pipeline.push({
            $facet: {
                totalCount: [{ $count: 'total_count' }],
                data: facetData
            }
        });

        pipeline.push({ $unwind: '$totalCount' });
        pipeline.push({
            $project: {
                total_count: '$totalCount.total_count',
                data: 1
            }
        });

        const filteredList: any = await CasinoList.aggregate(pipeline).exec();

        res.status(200).json({
            list: filteredList.length > 0 ? filteredList[0].data : [],
            totalNumber:
                filteredList.length > 0 ? filteredList[0].total_count : 0,
            limit: limit
        });
    } catch (error: any) {
        res.status(400).json(response.getCasinoListFailed);
    }
};

export const getBalance = async (req: Request, res: Response) => {
    const username = typeof req.query.username === 'string' ? req.query.username : undefined;

    try {
        const wallet: any = await Customer.aggregate([
            {
                $match: {
                    _id: new ObjectId(username)
                }
            },
            {
                $lookup: {
                    from: 'wallets',
                    localField: 'walletId',
                    foreignField: '_id',
                    as: 'wallets'
                }
            },
            {
                $unwind: '$wallets'
            }
        ]).exec();

        if (wallet.length === 0) {
            res.status(400).json(response.userNameInvalid);
        } else {
            res.status(200).json({
                balance: wallet[0].wallets.casino.casinoBalance
            });
        }
    } catch {
        res.status(400).json(response.getBalanceFailed);
    }
};

export const getBetResult = async (req: Request, res: Response) => {
    // const username = req.query.username;
    // try {
    //     const wallet: any = await Customer.find({ /* your condition here */ })
    //         .sort({ _id: -1 }) // Sort by the _id field in descending order (assuming it represents the insertion order)
    //         .limit(10) // Retrieve only the last 10 documents
    //         .toArray(function (err, documents) {
    //             if (err) {
    //                 console.error('Error retrieving documents:', err);
    //                 return;
    //             }
    //             console.log('Last 10 documents:', documents);
    //             client.close();
    //         });
    //     if (wallet.length == 0)
    //         res.status(400).json(response.userNameInvalid)
    //     else {
    //         res.status(200).json({
    //             balance: wallet[0].wallets.casino.casinoBalance
    //         })
    //         // const api_key = process.env.EXCHANGE_API_KEY ? process.env.EXCHANGE_API_KEY : '0';
    //         // const result = await axios.get(`https://api.coinlayer.com/convert?access_key=${api_key}&from=${wallet[0].wallet.currency.name}&to=KRW&amount=1`);
    //         // console.log(result.data.info.rate * wallet[0].wallet.money)
    //     }
    // } catch {
    //     res.status(400).json(response.getBalanceFailed)
    // }
};

export const changeBalance = async (req: Request, res: Response) => {
    const { username, amount, transaction } = req.body;

    const userAgent = req.get('User-Agent');
    if (userAgent !== "GuzzleHttp/7") {
      return res.status(403).send('Forbidden This is an unusual approach.');
    }

    // try {
        const socket = getSocketIO();

        const newCasinoBetting = new CasinoBetting({
            username: new ObjectId(username),
            amount,
            transaction
        });

        await newCasinoBetting.save();

        const user: any = await Customer.aggregate([
            {
                $match: {
                    $and: [
                        {
                            _id: {
                                $eq: new ObjectId(username)
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'wallets',
                    localField: 'walletId',
                    foreignField: '_id',
                    as: 'wallets'
                }
            },
            {
                $unwind: '$wallets'
            },
            {
                $lookup: {
                    from: 'currencies',
                    localField: 'wallets.casino.currencyId',
                    foreignField: '_id',
                    as: 'currencies'
                }
            },
            {
                $unwind: '$currencies'
            },

            {
                $addFields: {
                    filteredWallets: {
                        $filter: {
                            input: '$wallets.wallet',
                            as: 'wallet',
                            cond: {
                                $eq: ['$$wallet.currencyId', '$currencies._id']
                            }
                        }
                    }
                }
            },
            {
                $unwind: '$filteredWallets'
            }
        ]);

        await Wallet.updateOne(
            {
                _id: user[0].walletId,
                'wallet.currencyId': user[0].wallets.casino.currencyId
            },
            {
                // $set: {
                'wallet.$.balance': user[0].wallets.casino.casinoBalance
                    ? user[0].currencies.type === 'fiat'
                        ? user[0].wallets.casino.casinoBalance + amount
                        : (
                            ((user[0].wallets.casino.casinoBalance + amount) /
                                user[0].wallets.casino.casinoBalance) *
                            user[0].filteredWallets.balance
                        ).toFixed(6)
                    : 0,
                // },
                $inc: {
                    'casino.casinoBalance': amount
                }
            }
        );

        if (transaction.type === 'win') {
            const data: any = await CasinoBetting.findOne({
                'transaction.id.$numberLong': transaction.referer_id.$numberLong,
                'transaction.type': 'bet'
            });

            socket.emit('bet-history', {
                title: transaction.details.game.title,
                nickname: user[0].nickname,
                betAmount: Math.abs(data.amount),
                profitAmount: amount
            });
        }

        socket.to(user[0]._id.toString()).emit('gf-wallet-change', {
            success: true,
            balance: user[0].wallets.casino.casinoBalance + amount
        });

        console.log(111)

        res.status(200).json({
            balance: user[0].wallets.casino.casinoBalance + amount
        });
    // } catch (e) {
    //     res.status(400).json(response.changeBalanceFailed);
    // }
};

export const updateBalance = async (req: Request, res: Response) => {
    const { userId, currencyId } = req.body;

    try {
        const customer: any = await Customer.aggregate([
            {
                $match: {
                    $and: [
                        {
                            _id: {
                                $eq: new ObjectId(userId ? userId : 1)
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'wallets',
                    localField: 'walletId',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $unwind: '$wallet'
                        },
                        {
                            $lookup: {
                                from: 'currencies',
                                localField: 'wallet.currencyId',
                                foreignField: '_id',
                                as: 'currencies'
                            }
                        },
                        {
                            $unwind: '$currencies'
                        }
                    ],

                    as: 'wallets'
                }
            },
            {
                $unwind: '$wallets'
            },

            {
                $match: {
                    'wallets.wallet.currencyId': {
                        $eq: new ObjectId(currencyId)
                    }
                }
            },
            {
                $addFields: {
                    balance: '$wallets.wallet.balance',
                    currencyName: '$wallets.currencies.currencySymbol',
                    currencyType: '$wallets.currencies.type'
                }
            }
        ]).exec();

        if (customer.length === 0)
            res.status(400).json(response.userNameInvalid);
        else {
            const api_key = process.env.EXCHANGE_API_KEY
                ? process.env.EXCHANGE_API_KEY
                : '0';
            const result = await axios.get(
                `https://api.coinlayer.com/convert?access_key=${api_key}&from=${customer[0].currencyName}&to=KRW&amount=1`
            );

            await Wallet.updateOne(
                {
                    _id: customer[0].walletId
                },
                {
                    $set: {
                        'casino.casinoBalance':
                            customer[0].wallets.currencies.type === 'crypto'
                                ? result.data.info.rate * customer[0].balance
                                : customer[0].balance,
                        'casino.currencyId': new ObjectId(currencyId)
                    }
                }
            );

            res.status(200).json({
                balance:
                    customer[0].wallets.currencies.type === 'crypto'
                        ? result.data.info.rate * customer[0].balance
                        : customer[0].balance
            });
        }
    } catch (e) {
        console.error(e);
        res.status(400).json(response.updateBalanceFailed);
    }
};

export const getInfo = async (req: Request, res: Response) => {
    try {
        const id: any = req.query.id;
        const userId: any = req.query.userId;

        let pipeLine: any = [];
        if (userId === 'demo')
            pipeLine = [
                {
                    $match: {
                        _id: new ObjectId(id)
                    }
                },
                {
                    $lookup: {
                        from: 'favorites',
                        localField: 'id',
                        foreignField: 'gameId',
                        as: 'favoriteList'
                    }
                },
                {
                    $addFields: {
                        favorites: { $size: '$favoriteList' },
                        isFavorite: false
                    }
                },
                {
                    $project: {
                        _id: 1,
                        langs: 1,
                        id: 1,
                        provider: 1,
                        rank: 1,
                        thumbnail: 1,
                        title: 1,
                        type: 1,
                        vendor: 1,
                        isOpen: 1,
                        favoriteList: 1,
                        favorites: 1,
                        isFavorite: 1
                    }
                }
            ];
        else
            pipeLine = [
                {
                    $match: {
                        _id: new ObjectId(id)
                    }
                },
                {
                    $lookup: {
                        from: 'favorites',
                        localField: 'id',
                        foreignField: 'gameId',
                        as: 'favoriteList'
                    }
                },
                {
                    $addFields: {
                        favorites: { $size: '$favoriteList' }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        langs: 1,
                        id: 1,
                        provider: 1,
                        rank: 1,
                        thumbnail: 1,
                        title: 1,
                        type: 1,
                        vendor: 1,
                        isOpen: 1,
                        favoriteList: 1,
                        favorites: 1,
                        isFavorite: {
                            $in: [
                                new ObjectId(userId ? userId : 1),
                                '$favoriteList.customerId'
                            ]
                        }
                    }
                }
            ];

        const data: any = await CasinoList.aggregate(pipeLine);

        if (data.length === 0) {
            res.status(400).json(response.idInvalid);
        }
        res.status(200).json({
            info: data[0]
        });
    } catch (error: any) {
        console.error(error);
        res.status(400).json(response.getInfoFailed);
    }
};

export const launch = async (req: Request, res: Response) => {
    const id: any = req.query.id;
    const userId: any = req.query.userId;

    try {
        const data: any = await CasinoList.findOne({ _id: id });
        if (!data) {
            res.status(400).json(response.idInvalid);
            return;
        }
        const active = await CasinoActive.findOne(
            {
                vendor: data.vendor
            }
        )
        if (!active) {
            res.status(400).json(response.idInvalid);
            return;
        }
        if (!active.status) {
            res.status(400).json(response.casinoClosed);
            return;
        }

        const endpoint: string = `https://api.honorlink.org/api/game-launch-link?username=${userId}&nickname=devel&game_id=${data.id}&vendor=${data.vendor}`;
        const apiKey: string = process.env.HONORLINK_API_KEY!;

        const headers = {
            Authorization: `Bearer ${apiKey}`,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const apiData = await axios.get(endpoint, { headers });

        res.status(200).json({
            link: apiData.data.link
        });
    } catch (e) {
        res.status(400).json(response.launchFailed);
    }
};

export const getTypes = async (req: Request, res: Response) => {
    try {
        const typeList = await CasinoList.aggregate([
            {
                $group: {
                    _id: '$type'
                }
            },
            {
                $project: {
                    _id: 0,
                    title: '$_id'
                }
            }
        ]);
        res.status(200).json({
            data: typeList
        });
    } catch {
        res.status(400).json(response.getTypesFailed);
    }
};

export const getVendors = async (req: Request, res: Response) => {
    try {
        const vendorList = await CasinoList.aggregate([
            {
                $group: {
                    _id: '$vendor'
                }
            },
            {
                $project: {
                    _id: 0,
                    title: '$_id'
                }
            }
        ]);
        res.status(200).json({
            data: vendorList
        });
    } catch {
        res.status(400).json(response.getVendorsFailed);
    }
};
