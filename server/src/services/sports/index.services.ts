import { sleep } from "../../utils/library";

import * as oddsService from './odds.services';
import * as oddResultsService from './oddResults.services';
import * as logoService from './logo.services';
import * as socketService from "./socket.services";

import { sportOddModels, sportOddResultModels } from "../../data-access/utils";

const PREGAME_ODD_TIME = 30000;  // 15s
const LIVE_STATE_TIME = 1000;    // 1s

const runSportOddService = async (sportsName: string, DBmodel: any) => {
  await oddsService.processOdds(sportsName, DBmodel);
  await logoService.updateSportsLogo(sportsName, DBmodel);
  socketService.emitAllMatches(sportsName, DBmodel);
}

export const runSportOddsApi = async () => {
  try {
    const apiPromises = [];

    for (const [key, model] of Object.entries(sportOddModels)) {
      // console.log(key);
      apiPromises.push(runSportOddService(key, model));
    }
    await Promise.all(apiPromises);
    await sleep(PREGAME_ODD_TIME);
    runSportOddsApi();
  } catch (err) {
    console.error(err);
  }
}

export const runSportOddResultService = async (sportsName: string, dbModel: any) => {
  await oddResultsService.processOddResults(sportsName, dbModel);
}

export const runSportOddResultsApi = async () => {
  try {
    const apiPromises = [];

    for (const [key, model] of Object.entries(sportOddResultModels)) {
      // console.log(key);
      apiPromises.push(runSportOddResultService(key, model));
    }
    await Promise.all(apiPromises);
    await sleep(PREGAME_ODD_TIME);
    runSportOddResultsApi();
  } catch (err) {
    console.error(err);
  }
}