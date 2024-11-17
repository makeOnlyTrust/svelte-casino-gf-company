// Model
import SoccerOddsModel from '../models/sports/soccerOdds.model';

export const findAllMatches = async (date: Date) => {
    try {
        const oddsData = await SoccerOddsModel.aggregate([
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
                    "transformedDate": { $gte: date },
                    "league_id": { $eq: '1204' }
                }
            },
            {
                $lookup: {
                    from: "sportslogos",
                    localField: "league_id",
                    foreignField: "id",
                    pipeline: [
                        { $match: { sportsName: "soccer", category: "leagues" } }
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
                    localField: "localteam.id",
                    foreignField: "id",
                    pipeline: [
                        { $match: { sportsName: "soccer", category: "teams" } }
                    ],
                    as: "localteam_logo"
                }
            },
            {
                $unwind: { path: "$localteam_logo", preserveNullAndEmptyArrays: true }
            },
            {
                $lookup: {
                    from: "sportslogos",
                    localField: "visitorteam.id",
                    foreignField: "id",
                    pipeline: [
                        { $match: { sportsName: "soccer", category: "teams" } }
                    ],
                    as: "visitorteam_logo"
                }
            },
            {
                $unwind: { path: "$visitorteam_logo", preserveNullAndEmptyArrays: true }
            },
            {
                $addFields: {
                    "league_url": "$league_logo.path",
                    "localteam.url": "$localteam_logo.path",
                    "visitorteam.url": "$visitorteam_logo.path"
                }
            },
            {
                $sort: { "transformedDate": 1 }
            },
            {
                $project: {
                    league_logo: 0,
                    localteam_logo: 0,
                    visitorteam_logo: 0
                }
            }
        ]);

        return oddsData;
    } catch (err) {
        console.error(err);
        return [];
    }
}

export const findMatch = async (matchId: string) => {
    try {
        const oddData = await SoccerOddsModel.aggregate([
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
                        { $match: { sportsName: "soccer", category: "leagues" } }
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
                    localField: "localteam.id",
                    foreignField: "id",
                    pipeline: [
                        { $match: { sportsName: "soccer", category: "teams" } }
                    ],
                    as: "localteam_logo"
                }
            },
            {
                $unwind: { path: "$localteam_logo", preserveNullAndEmptyArrays: true }
            },
            {
                $lookup: {
                    from: "sportslogos",
                    localField: "visitorteam.id",
                    foreignField: "id",
                    pipeline: [
                        { $match: { sportsName: "soccer", category: "teams" } }
                    ],
                    as: "visitorteam_logo"
                }
            },
            {
                $unwind: { path: "$visitorteam_logo", preserveNullAndEmptyArrays: true }
            },
            {
                $addFields: {
                    "league_url": "$league_logo.path",
                    "localteam.url": "$localteam_logo.path",
                    "visitorteam.url": "$visitorteam_logo.path"
                }
            },
            {
                $project: {
                    league_logo: 0,
                    localteam_logo: 0,
                    visitorteam_logo: 0
                }
            }
        ]);

        return oddData;
    } catch (err) {
        console.error(err);
        return [];
    }
}

export const findMatchByLeague = async (leagueId: string) => {
    try {
        const oddData = await SoccerOddsModel.aggregate([
            {
                $match: {
                    "league_id": { $eq: leagueId }
                }
            },
            {
                $lookup: {
                    from: "sportslogos",
                    localField: "league_id",
                    foreignField: "id",
                    pipeline: [
                        { $match: { sportsName: "soccer", category: "leagues" } }
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
                    localField: "localteam.id",
                    foreignField: "id",
                    pipeline: [
                        { $match: { sportsName: "soccer", category: "teams" } }
                    ],
                    as: "localteam_logo"
                }
            },
            {
                $unwind: { path: "$localteam_logo", preserveNullAndEmptyArrays: true }
            },
            {
                $lookup: {
                    from: "sportslogos",
                    localField: "visitorteam.id",
                    foreignField: "id",
                    pipeline: [
                        { $match: { sportsName: "soccer", category: "teams" } }
                    ],
                    as: "visitorteam_logo"
                }
            },
            {
                $unwind: { path: "$visitorteam_logo", preserveNullAndEmptyArrays: true }
            },
            {
                $addFields: {
                    "league_url": "$league_logo.path",
                    "localteam.url": "$localteam_logo.path",
                    "visitorteam.url": "$visitorteam_logo.path"
                }
            },
            {
                $project: {
                    league_logo: 0,
                    localteam_logo: 0,
                    visitorteam_logo: 0
                }
            }
        ]);

        return oddData;
    } catch (err) {
        console.error(err);
        return [];
    }
}
