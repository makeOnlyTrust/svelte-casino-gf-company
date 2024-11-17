import { ObjectId } from 'mongodb';
import { PipelineStage } from 'mongoose';

import SportsMainLeagueModel from '../models/sports/sportsMainLeagues.model';

import { defineKinds, sportOddModels } from "./utils";
import SportsMainOddNamesModel from '../models/sports/sportsMainOddNames.model';

export const getMainOdds = async () => {
    try {
        const promiseArr = Object.entries(sportOddModels).map(async ([key, model]) => {
            const { category, matchA, matchB } = defineKinds(key);

            const pipeline = [
                {
                    $sort: {
                        "formatted_date": 1
                    }
                },
                {
                    $lookup: {
                        from: 'sportsmainleagues',
                        localField: 'league_id',
                        foreignField: 'leagueId',
                        as: 'mainLeagues'
                    }
                },
                {
                    $match: {
                        'mainLeagues.sportsName': key,
                        'mainLeagues.type': 'odds'
                    }
                },
                {
                    $limit: 6
                },
                {
                    $lookup: {
                        from: "sportslogos",
                        localField: "league_id",
                        foreignField: "id",
                        pipeline: [
                            { $match: { sportsName: key, category: "leagues" } }
                        ],
                        as: "league_logo"
                    }
                },
                {
                    $unwind: { path: "$league_logo", preserveNullAndEmptyArrays: true }
                },
                {
                    $lookup: {
                        from: "sportslogos",
                        localField: `${matchA}.id`,
                        foreignField: "id",
                        pipeline: [
                            { $match: { sportsName: key, category: category } }
                        ],
                        as: "matchA_logo"
                    }
                },
                {
                    $unwind: { path: "$matchA_logo", preserveNullAndEmptyArrays: true }
                },
                {
                    $lookup: {
                        from: "sportslogos",
                        localField: `${matchB}.id`,
                        foreignField: "id",
                        pipeline: [
                            { $match: { sportsName: key, category: category } }
                        ],
                        as: "matchB_logo"
                    }
                },
                {
                    $unwind: { path: "$matchB_logo", preserveNullAndEmptyArrays: true }
                },
                {
                    $addFields: {
                        "league_url": "$league_logo.path",
                        [`${matchA}.url`]: "$matchA_logo.path",
                        [`${matchB}.url`]: "$matchB_logo.path"
                    }
                },
                {
                    $addFields: {
                        matchA: `$${matchA}`,
                        matchB: `$${matchB}`
                    }
                },
                {
                    $project: {
                        league_logo: 0,
                        matchA_logo: 0,
                        matchB_logo: 0,
                        [`${matchA}`]: 0,
                        [`${matchB}`]: 0
                    }
                }
            ] as PipelineStage[];

            const oddData = await model.aggregate(pipeline);

            return {
                [key]: oddData
            }
            
        })

        const dataArr = await Promise.all(promiseArr);

        const oddsData = dataArr.reduce((accumulator, current) => {
            const [key, value] = Object.entries(current)[0];
            accumulator[key] = value;
            return accumulator;
        }, {});

        const mainOddNames = await SportsMainOddNamesModel.find({});

        return {
            oddNames: mainOddNames,
            odds: oddsData
        };
    } catch (err) {
        console.error(err);
    }
}

export const findAllMatches = async (DBModel: any, sportsName: string, date: Date) => {
    try {
        const { category, matchA, matchB } = defineKinds(sportsName);

        const pipeline = [
            {
                $addFields: {
                    "transformedDate": {
                        $dateFromString: {
                            dateString: {
                                $concat: [
                                    "$formatted_date",
                                    "T",
                                    "$time",
                                    ":00.000Z"
                                ]
                            }
                        }
                    }
                }
            },
            {
                $match: {
                    "transformedDate": { $gte: date }
                }
            },
            {
                $lookup: {
                    from: "sportslogos",
                    localField: "league_id",
                    foreignField: "id",
                    pipeline: [
                        { $match: { sportsName: sportsName, category: "leagues" } }
                    ],
                    as: "league_logo"
                }
            },
            {
                $unwind: { path: "$league_logo", preserveNullAndEmptyArrays: true }
            },
            {
                $lookup: {
                    from: "sportslogos",
                    localField: `${matchA}.id`,
                    foreignField: "id",
                    pipeline: [
                        { $match: { sportsName: sportsName, category: category } }
                    ],
                    as: "matchA_logo"
                }
            },
            {
                $unwind: { path: "$matchA_logo", preserveNullAndEmptyArrays: true }
            },
            {
                $lookup: {
                    from: "sportslogos",
                    localField: `${matchB}.id`,
                    foreignField: "id",
                    pipeline: [
                        { $match: { sportsName: sportsName, category: category } }
                    ],
                    as: "matchB_logo"
                }
            },
            {
                $unwind: { path: "$matchB_logo", preserveNullAndEmptyArrays: true }
            },
            {
                $sort: { "transformedDate": 1 }
            },
            {
                $addFields: {
                    "league_url": "$league_logo.path",
                    [`${matchA}.url`]: "$matchA_logo.path",
                    [`${matchB}.url`]: "$matchB_logo.path"
                }
            },
            {
                $addFields: {
                    matchA: `$${matchA}`,
                    matchB: `$${matchB}`
                }
            },
            {
                $project: {
                    league_logo: 0,
                    matchA_logo: 0,
                    matchB_logo: 0,
                    [`${matchA}`]: 0,
                    [`${matchB}`]: 0
                }
            }
        ];

        const oddsData = await DBModel.aggregate(pipeline);

        return oddsData;
    } catch (err) {
        console.error(err);
        return [];
    }
}

export const findMatch = async (DBModel: any, sportsName: string, matchId: string) => {
    try {
        const { category, matchA, matchB } = defineKinds(sportsName);

        const pipeline = [
            {
                $match: {
                    "id": { $eq: matchId }
                }
            },
            {
                $lookup: {
                    from: "sportslogos",
                    localField: "league_id",
                    foreignField: "id",
                    pipeline: [
                        { $match: { sportsName: sportsName, category: "leagues" } }
                    ],
                    as: "league_logo"
                }
            },
            {
                $unwind: { path: "$league_logo", preserveNullAndEmptyArrays: true }
            },
            {
                $lookup: {
                    from: "sportslogos",
                    localField: `${matchA}.id`,
                    foreignField: "id",
                    pipeline: [
                        { $match: { sportsName: sportsName, category: category } }
                    ],
                    as: "matchA_logo"
                }
            },
            {
                $unwind: { path: "$matchA_logo", preserveNullAndEmptyArrays: true }
            },
            {
                $lookup: {
                    from: "sportslogos",
                    localField: `${matchB}.id`,
                    foreignField: "id",
                    pipeline: [
                        { $match: { sportsName: sportsName, category: category } }
                    ],
                    as: "matchB_logo"
                }
            },
            {
                $unwind: { path: "$matchB_logo", preserveNullAndEmptyArrays: true }
            },
            {
                $addFields: {
                    "league_url": "$league_logo.path",
                    [`${matchA}.url`]: "$matchA_logo.path",
                    [`${matchB}.url`]: "$matchB_logo.path"
                }
            },
            {
                $addFields: {
                    matchA: `$${matchA}`,
                    matchB: `$${matchB}`
                }
            },
            {
                $project: {
                    league_logo: 0,
                    matchA_logo: 0,
                    matchB_logo: 0,
                    [`${matchA}`]: 0,
                    [`${matchB}`]: 0
                }
            }
        ]

        const oddData = await DBModel.aggregate(pipeline);

        return oddData;
    } catch (err) {
        console.error(err);
        return [];
    }
}

export const findMatchByLeague = async (DBModel: any, sportsName: string, leagueId?: string) => {
    try {
        const { category, matchA, matchB } = defineKinds(sportsName);

        let pipeline = [];

        if (!leagueId) {
            const leagueIdData = await SportsMainLeagueModel.findOne({
                sportsName: sportsName,
                type: 'odds'
            });

            if (leagueIdData && leagueIdData.leagueId) {
                leagueId = leagueIdData.leagueId;
            }
        }

        if (leagueId) {
            pipeline.push(
                {
                    $match: {
                        "league_id": { $eq: leagueId }
                    }
                }
            )
        }

        pipeline.push(
            {
                $lookup: {
                    from: "sportslogos",
                    localField: "league_id",
                    foreignField: "id",
                    pipeline: [
                        { $match: { sportsName: sportsName, category: "leagues" } }
                    ],
                    as: "league_logo"
                }
            },
            {
                $unwind: { path: "$league_logo", preserveNullAndEmptyArrays: true }
            },
            {
                $lookup: {
                    from: "sportslogos",
                    localField: `${matchA}.id`,
                    foreignField: "id",
                    pipeline: [
                        { $match: { sportsName: sportsName, category: category } }
                    ],
                    as: "matchA_logo"
                }
            },
            {
                $unwind: { path: "$matchA_logo", preserveNullAndEmptyArrays: true }
            },
            {
                $lookup: {
                    from: "sportslogos",
                    localField: `${matchB}.id`,
                    foreignField: "id",
                    pipeline: [
                        { $match: { sportsName: sportsName, category: category } }
                    ],
                    as: "matchB_logo"
                }
            },
            {
                $unwind: { path: "$matchB_logo", preserveNullAndEmptyArrays: true }
            },
            {
                $addFields: {
                    "league_url": "$league_logo.path",
                    [`${matchA}.url`]: "$matchA_logo.path",
                    [`${matchB}.url`]: "$matchB_logo.path"
                }
            },
            {
                $addFields: {
                    matchA: `$${matchA}`,
                    matchB: `$${matchB}`
                }
            },
            {
                $project: {
                    league_logo: 0,
                    matchA_logo: 0,
                    matchB_logo: 0,
                    [`${matchA}`]: 0,
                    [`${matchB}`]: 0
                }
            }
        )

        const oddData = await DBModel.aggregate(pipeline);

        return oddData;
    } catch (err) {
        console.error(err);
        return [];
    }
}

export const findLeagueList = async (DBModel: any, sportsName: string, userId: string) => {
    try {
        const leagueData = await DBModel.aggregate([
            {
                $lookup: {
                    from: "favorites",
                    let: { leagueId: "$league_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$gameId", "$$leagueId"] },
                                        { $eq: ["$type", sportsName] },
                                        { $eq: ["$customerId", new ObjectId(userId ? userId : 1)] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "favoriteInfo"
                }
            }, {
                $addFields: {
                    isFavorite: { $gt: [{ $size: "$favoriteInfo" }, 0] }
                }
            }, {
                $group: {
                    _id: "$league_id",
                    name: { $first: "$league_name" },
                    matches_count: { $sum: 1 },
                    isFavorite: { $first: "$isFavorite" }
                }
            }, {
                $sort: {
                    name: 1
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

        return leagueData;
    } catch (err) {
        console.error(err);
        return [];
    }
}