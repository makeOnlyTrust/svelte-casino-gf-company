import { Request, Response } from 'express';

// Config
import * as response from '../config/response';

// Service
import * as sportsServices from '../services/api/sportsApi.services';

// Data access
import * as Timestamp from '../data-access/timestamp';
import * as SportsOdds from '../data-access/sportsOdds';
import { sportsNameType, sportOddModels, getTimestampKey } from '../data-access/utils';

export const getMainOdds = async (req: Request, res: Response) => {
    try {
        const mainOdds = await SportsOdds.getMainOdds();

        res.status(200).json(mainOdds);
    } catch (err) {
        console.error(err);
    }
}

export const getMatches = async (req: Request, res: Response) => {
    try {
        const sportsName = req.params.sports as sportsNameType;

        if (!sportsName) {
            res.status(400).json(response.ApiFailed);
            return;
        }
        // const { minUTCDate, maxUTCDate } = getMinMaxUTCDate(0, 30);

        const DBModel = sportOddModels[sportsName];
        if (!DBModel) {
            res.status(400).json(response.ApiFailed);
            return;
        }

        // const oddsData = await SportsOdds.findAllMatches(DBModel, sportsName, minUTCDate);
        const oddsData = await SportsOdds.findMatchByLeague(DBModel, sportsName);

        const timestampData = await Timestamp.getTimestamp({
            sportsName: getTimestampKey(sportsName),
            type: 'odds'
        });

        res.status(200).json({
            odd: oddsData,
            timestamp: timestampData
        });
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
};

export const getMatchById = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        const sportsName = req.params.sports as sportsNameType;

        if (!sportsName) {
            res.status(400).json(response.ApiFailed);
            return;
        }
        const DBModel = sportOddModels[sportsName];

        if (!DBModel) {
            res.status(400).json(response.ApiFailed);
            return;
        }

        const oddData = await SportsOdds.findMatch(DBModel, sportsName, id);
        const timestampData = await Timestamp.getTimestamp({
            sportsName: getTimestampKey(sportsName),
            type: 'odds'
        });

        res.status(200).json({
            odd: oddData[0],
            timestamp: timestampData
        });
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
};

export const getLeagueList = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body as any;
        const sportsName = req.params.sports as sportsNameType;

        if (!sportsName) {
            res.status(400).json(response.ApiFailed);
            return;
        }
        const DBModel = sportOddModels[sportsName];

        if (!DBModel) {
            res.status(400).json(response.ApiFailed);
            return;
        }
        const leagueData = await SportsOdds.findLeagueList(DBModel, sportsName, userId)

        res.status(200).json(leagueData);
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
};

export const getMatchesByLeagueId = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        const sportsName = req.params.sports as sportsNameType;

        if (!sportsName) {
            res.status(400).json(response.ApiFailed);
            return;
        }
        const DBModel = sportOddModels[sportsName];

        if (!DBModel) {
            res.status(400).json(response.ApiFailed);
            return;
        }

        const oddsData = await SportsOdds.findMatchByLeague(DBModel, sportsName, id);
        const timestampData = await Timestamp.getTimestamp({
            sportsName: getTimestampKey(sportsName),
            type: 'odds'
        });

        res.status(200).json({
            odd: oddsData,
            timestamp: timestampData
        });
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
};

export const getLeagueIds = async (req: Request, res: Response) => {
    try {
        const resData = await sportsServices.getLeagueIds();
        console.log('resData = ', resData);
        res.status(200).json(resData);
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
};

export const getLeagueSeasons = async (req: Request, res: Response) => {
    try {
        const resData = await sportsServices.getLeagueSeasons();
        console.log('resData = ', resData);
        res.status(200).json(resData);
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
};

export const getFixture = async (req: Request, res: Response) => {
    const { id } = req.body;

    try {
        const resData = await sportsServices.getFixture(id);
        console.log('resData = ', resData);
        res.status(200).json(resData);
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
};

export const getTeamAbbr = async (req: Request, res: Response) => {
    try {
        const resData = await sportsServices.getTeamAbbr();
        console.log('resData = ', resData);
        res.status(200).json(resData);
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
};

export const getHistory = async (req: Request, res: Response) => {
    const { leagueIds } = req.body;

    try {
        const resData = await sportsServices.getHistory(leagueIds);
        console.log('resData = ', resData);
        res.status(200).json(resData);
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
};

export const getLeague = async (req: Request, res: Response) => {
    const { leagueId } = req.body;

    try {
        const resData = await sportsServices.getLeague(leagueId);
        console.log('resData = ', resData);
        res.status(200).json(resData);
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
};

export const getCommentary = async (req: Request, res: Response) => {
    const { id } = req.body;

    try {
        const resData = await sportsServices.getCommentary(id);
        console.log('resData = ', resData);
        res.status(200).json(resData);
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
};

export const getInjury = async (req: Request, res: Response) => {
    try {
        const resData = await sportsServices.getInjury();
        console.log('resData = ', resData);
        res.status(200).json(resData);
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
};

export const getHighlight = async (req: Request, res: Response) => {
    const { date } = req.body;

    try {
        const resData = await sportsServices.getHighlight(date);
        console.log('resData = ', resData);
        res.status(200).json(resData);
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
};

export const getStanding = async (req: Request, res: Response) => {
    const { leagueId } = req.body;

    try {
        const resData = await sportsServices.getStanding(leagueId);
        console.log('resData = ', resData);
        res.status(200).json(resData);
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
};

export const getTopscore = async (req: Request, res: Response) => {
    const { leagueId } = req.body;

    try {
        const resData = await sportsServices.getTopscore(leagueId);
        console.log('resData = ', resData);
        res.status(200).json(resData);
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
};

export const getSoccerStats = async (req: Request, res: Response) => {
    const { type, id } = req.body;

    try {
        const resData = await sportsServices.getSoccerStats(type, id);
        console.log('resData = ', resData);
        res.status(200).json(resData);
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
};

export const getHTwoH = async (req: Request, res: Response) => {
    const { team1Id, team2Id } = req.body;

    try {
        const resData = await sportsServices.getHTwoH(team1Id, team2Id);
        console.log('resData = ', resData);
        res.status(200).json(resData);
    } catch (err) {
        console.error(err);
        res.status(400).json(response.ApiFailed);
    }
};
