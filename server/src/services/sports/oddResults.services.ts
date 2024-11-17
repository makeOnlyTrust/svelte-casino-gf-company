// Service
import * as sportsApiServices from '../api/sportsApi.services';

import { convertSportsOddResultsType, sportsOddResultParam } from './utils';

export const processOddResults = async (sportsName: string, DBModel: any) => {
    try {
        const oddResultParam = sportsOddResultParam(sportsName);

        const oddResultsData = await sportsApiServices.getOddResults(oddResultParam, 0);

        const categories = oddResultsData.scores.category;

        const newOddResults = convertSportsOddResultsType(categories);
    } catch (err) {
        console.error(err);
        return [];
    }
}
