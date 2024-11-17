// Import Soccer odds models
import SoccerOddsModel from '../models/sports/soccerOdds.model';
import TennisOddsModel from '../models/sports/tennisOdds.model';
import BasketballOddsModel from '../models/sports/basketballOdds.model';
import HockeyOddsModel from '../models/sports/hockeyOdds.model';
import HandballOddsModel from '../models/sports/handballOdds.model';
import VolleyballOddsModel from '../models/sports/volleyballOdds.model';
import FootballOddsModel from '../models/sports/footballOdds.model';
import RugbyOddsModel from '../models/sports/rugbyOdds.model';
import BaseballOddsModel from '../models/sports/baseballOdds.model';
import BoxingOddsModel from '../models/sports/boxingOdds.model';
import EsportsOddsModel from '../models/sports/esportsOdds.model';
import TableTennisOddsModel from '../models/sports/tableTennisOdds.model';
import GolfOddsModel from '../models/sports/golfOdds.model';
import DartsOddsModel from '../models/sports/dartsOdds.model';
import RugbyLeagueOddsModel from '../models/sports/rugbyLeagueOdds.model';

// Import soccer odds result models
import SoccerOddResultsModel from '../models/sports/soccerOddResults.model';

export type sportsNameType = 
    "soccer" | 
    "tennis" |
    "basketball" |
    "hockey" |
    "handball" |
    "volleyball" |
    "american-football" |
    "rugby" |
    "baseball" |
    "boxing" |
    "esports" |
    "table-tennis" |
    "golf" |
    "darts" |
    "rugby-league";

export const sportOddModels = {
    "soccer": SoccerOddsModel,
    "tennis": TennisOddsModel,
    "basketball": BasketballOddsModel,
    "hockey": HockeyOddsModel,
    "handball": HandballOddsModel,
    "volleyball": VolleyballOddsModel,
    "american-football": FootballOddsModel,
    "rugby": RugbyOddsModel,
    "baseball": BaseballOddsModel,
    "boxing": BoxingOddsModel,
    "esports": EsportsOddsModel,
    "table-tennis": TableTennisOddsModel,
    "golf": GolfOddsModel,
    "darts": DartsOddsModel,
    "rugby-league": RugbyLeagueOddsModel
}

export const sportOddResultModels = {
    "soccer": SoccerOddResultsModel,
}

export const getTimestampKey = (sportsName: string) => {
    switch (sportsName) {
        case 'soccer':
        case 'tennis':
        case 'basketball':
        case 'hockey':
        case 'handball':
        case 'volleyball':
        case 'rugby':
        case 'baseball':
        case 'boxing':
        case 'esports':
        case 'golf':
        case 'darts':
            return sportsName;
        case 'american-football':
            return 'football';
        case 'table-tennis':
            return 'table_tennis';
        case 'rugby-league':
            return 'rugby_league';
        default:
            return '';
    }
}

export const defineKinds = (sportsName: string) => {
    let category = '';
    let matchA = '';
    let matchB = '';

    switch (sportsName) {
        case 'soccer':
        case 'esports':
            category = 'teams';
            matchA = 'localteam';
            matchB = 'visitorteam';
            break;

        case 'tennis':
        case 'table-tennis':
        case 'darts':
            category = 'players';
            matchA = 'player_1';
            matchB = 'player_2';
            break;

        case 'basketball':
        case 'hockey':
        case 'handball':
        case 'volleyball':
        case 'american-football':
        case 'rugby':
        case 'baseball':
        case 'boxing':
        case 'golf':
        case 'rugby-league':
            category = 'teams';
            matchA = 'localteam';
            matchB = 'awayteam';
            break;
    }

    return {
        category,
        matchA,
        matchB
    }
}