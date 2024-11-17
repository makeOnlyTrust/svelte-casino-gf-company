// Model
import SportsLogoModel from '../models/sports/sportsLogo.model';
import { defineKinds } from './utils';

export const addSportsLogos = async (data: any) => {
    if (data.length > 0) {
        await SportsLogoModel.insertMany(data);
    }
}

export const getSportsLogos = async (where: any) => {
    return await SportsLogoModel.find(where);
}

export const getUnregisteredLogoIdList = async (sportsName: string, DBModel: any) => {
    try {
        const { category, matchA, matchB } = defineKinds(sportsName);

        const pipeline = [
            {
                $lookup: {
                    from: "sportslogos",
                    let: { leagueId: "$league_id" },
                    pipeline: [
                        {
                            $match:
                            {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$id", "$$leagueId"] },
                                        { $eq: ["$sportsName", sportsName] },
                                        { $eq: ["$category", "leagues"] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "matchedLeague"
                }
            },
            { $match: { "matchedLeague": { $eq: [] } } },
            {
                $lookup: {
                    from: "sportslogos",
                    let: { matchAId: `$${matchA}.id` },
                    pipeline: [
                        {
                            $match:
                            {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$id", "$$matchAId"] },
                                        { $eq: ["$sportsName", sportsName] },
                                        { $eq: ["$category", category] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "matchedA"
                }
            },
            { $match: { "matchedA": { $eq: [] } } },
            {
                $lookup: {
                    from: "sportslogos",
                    let: { matchBId: `$${matchB}.id` },
                    pipeline: [
                        {
                            $match:
                            {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$id", "$$matchBId"] },
                                        { $eq: ["$sportsName", sportsName] },
                                        { $eq: ["$category", category] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "matchedB"
                }
            },
            { $match: { "matchedB": { $eq: [] } } },
            {
                $group: {
                    _id: null,
                    league_ids: { $addToSet: "$league_id" },
                    matchA_ids: { $addToSet: `$${matchA}.id` },
                    matchB_ids: { $addToSet: `$${matchB}.id` }
                }
            },
            {
                $project: {
                    _id: 0,
                    league_ids: 1,
                    team_ids: { $setUnion: ["$matchA_ids", "$matchB_ids"] }
                }
            }
        ];

        const idList = await DBModel.aggregate(pipeline);

        return idList;
    } catch (err) {
        console.error(err);
        return [];
    }
}