import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

// Config
import * as response from '../config/response';

// Model
import Favorite from '../models/favorite.model';
import Customer from '../models/customer.model';

export const createFavorite = async (req: Request, res: Response) => {
    const { userId, gameId, type } = req.body;

    try {
        const newFavorite = new Favorite({
            customerId: userId,
            gameId,
            type
        });
        await newFavorite.save();
        res.status(200).json(response.createFavoriteSuccess);
    } catch {
        res.status(400).json(response.createFavoriteFailed);
    }
};

export const deleteFavorite = async (req: Request, res: Response) => {
    const { userId, gameId, type } = req.body;

    try {
        await Favorite.deleteMany({
            customerId: userId,
            gameId,
            type
        });

        res.status(200).json(response.deleteFavoriteSuccess);
    } catch {
        res.status(400).json(response.deleteFavoriteFailed);
    }
};

export const getFavoriteList = async (req: Request, res: Response) => {
    const userId: any = req.query.userId;

    try {
        const casinoData = await Favorite.aggregate([
            {
                $match: {
                    'customerId': {
                        $eq: new ObjectId(userId ? userId : 1)
                    }
                }
            },
            {
                $lookup: {
                    from: 'casinolists',
                    localField: 'gameId',
                    foreignField: 'id',
                    as: 'casinolists'
                }
            },
            {
                $unwind: '$casinolists'
            },
            {
                $addFields: {
                    thumbnail: '$casinolists.thumbnail',
                    title: '$casinolists.title',
                    favorites: true,
                    id: '$casinolists.id',
                    _id: '$casinolists._id'
                }
            }
        ]);

        const soccerData = await Favorite.aggregate([
            {
                $match: {
                    $and: [
                        { 'customerId': { $eq: new ObjectId(userId ? userId : 1) } },
                        { 'type': { $eq: 'soccer' } }
                    ]
                }
            }, {
                $lookup: {
                    from: 'soccerodds',
                    localField: 'gameId',
                    foreignField: 'league_id',
                    as: 'soccerFavoriteList'
                }
            }, {
                $unwind: '$soccerFavoriteList'
            }, {
                $group: {
                    _id: '$soccerFavoriteList.league_id',
                    name: { $first: "$soccerFavoriteList.league_name" },
                    matches_count: { $sum: 1 }
                }
            }, {
                $addFields: {
                    isFavorite: true
                }
            }, {
                $project: {
                    _id: 0,
                    id: "$_id",
                    name: 1,
                    matches_count: 1,
                    isFavorite: 1
                }
            }
        ]);

        const minigameData = await Favorite.aggregate([
            {
                $match: {
                    'customerId': {
                        $eq: new ObjectId(userId ? userId : 1)
                    }
                }
            },
            {
                $lookup: {
                    from: 'minigamelists',
                    localField: 'gameId',
                    foreignField: 'gameId',
                    as: 'minigamelists'
                }
            },
            {
                $unwind: '$minigamelists'
            },
            {
                $addFields: {
                    thumbnail: '$minigamelists.thumbnail',
                    title: '$minigamelists.title',
                    favorites: true,
                    id: '$minigamelists.gameId',
                    _id: '$minigamelists._id',
                    category: '$minigamelists.category',
                }
            }
        ]);

        res.status(200).json({
            casino: casinoData,
            soccer: soccerData,
            minigame: minigameData
        });
    } catch {
        res.status(400).json(response.getVendorsFailed);
    }
};
