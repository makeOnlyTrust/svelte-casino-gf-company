// Service
import * as sportsApiServices from '../api/sportsApi.services';

// Utills
import { compareNumber, getUTCTime } from '../../utils/library';
import { convertSportsOddsType, getSportsOddsParam } from './utils';

// Data Access
import { getTimestampKey } from '../../data-access/utils';
import { addTimestamp, getTimestamp, updateTimestamp } from '../../data-access/timestamp';

const OLD_ODD_DATE = 2;

const updateOdds = async (DBModel: any, oddsData: any, timestamp: string) => {
    const updateMatchPromises = oddsData.map(async (match: any) => {
        const _match = await DBModel.findOneAndDelete({ id: match.id });

        if (_match) {
            const odds = match.odds.map((odd: any) => {
                const _oddIndex = _match.odds.findIndex((ele: any) => ele.id === odd.id);

                if (_oddIndex !== -1) {
                    const _odd = _match.odds[_oddIndex];
                    _match.odds.splice(_oddIndex, 1);

                    const updateSubOdds = odd.bookmakers[0].odds.map((subOdd: any) => {
                        const _subOddIndex = _odd.bookmakers[0].odds.findIndex((ele: any) => ele.name === subOdd.name);

                        if (_subOddIndex !== -1) {
                            const _subOdd = _odd.bookmakers[0].odds[_subOddIndex];
                            _odd.bookmakers[0].odds.splice(_subOddIndex, 1);

                            const state = compareNumber(Number(subOdd.value), Number(_subOdd.value));

                            if (subOdd.odds) {
                                const updateNestOdd = subOdd.odds.map((nestOdd: any) => {
                                    const _nestOddIndex = _subOdd.odds.findIndex((ele: any) => ele.name === nestOdd.name);

                                    if (_nestOddIndex !== -1) {
                                        const _nestOdd = _subOdd.odds[_nestOddIndex];
                                        _subOdd.odds.splice(_nestOddIndex, 1);

                                        const state = compareNumber(Number(nestOdd.value), Number(_nestOdd.value));

                                        return {
                                            ...nestOdd,
                                            state: state,
                                            timestamp: timestamp
                                        };
                                    } else {
                                        return nestOdd;
                                    }
                                })

                                return { 
                                    ...subOdd, 
                                    odds: [..._subOdd.odds, ...updateNestOdd],
                                };
                            } else {
                                return {
                                    ...subOdd,
                                    state: state,
                                    timestamp: timestamp
                                };
                            }
                        } else {
                            return subOdd;
                        }
                    });

                    return { ...odd, bookmakers: [{ ...odd.bookmakers[0], odds: [..._odd.bookmakers[0].odds, ...updateSubOdds] }] };
                } else {
                    return odd;
                }
            });

            return { ...match, odds: [..._match.odds, ...odds] }
        } else {
            return match;
        }
    });
    const updateMatches = await Promise.all(updateMatchPromises);

    await DBModel.insertMany(updateMatches);
}

export const processOdds = async (sportsName: string, DBModel: any) => {
    try {
        const timestampKey = getTimestampKey(sportsName);

        const tsData = await getTimestamp({
            sportsName: timestampKey,
            type: 'odds'
        });

        let params: any = {
            type: getSportsOddsParam(sportsName),
            bm: '105'
        }

        if (tsData?.ts) {
            params = {
                ...params,
                timestamp: tsData.ts
            }
        } else if (sportsName === 'soccer') {
            params = {
                ...params,
                league: [1204]
            }
        }

        const oddsData = await sportsApiServices.getOdds(params);

        if (!tsData) {
            await addTimestamp(timestampKey, 'odds', oddsData.scores.ts);

            const newOddsData = convertSportsOddsType(sportsName, oddsData.scores.categories);
            await DBModel.insertMany(newOddsData);

            return [];
        }

        await deleteOldOddData(DBModel, OLD_ODD_DATE);

        if (!oddsData.scores.ts || (tsData && tsData.ts && oddsData.scores.ts !== tsData.ts)) {
            const oddsCount = await DBModel.countDocuments({});
            const newOddsData = convertSportsOddsType(sportsName, oddsData.scores.categories);

            if (oddsCount === 0) {
                await DBModel.insertMany(newOddsData);
            } else {
                await updateOdds(DBModel, newOddsData, oddsData.scores.ts);
            }

            await updateTimestamp(timestampKey, 'odds', oddsData.scores.ts);
        }

        return oddsData.scores.categories;
    } catch (err) {
        console.error(err);
        return [];
    }
}

const deleteOldOddData = async (DBModel: any, date: number) => {
    try {
        const oldDate = new Date();
        oldDate.setDate(oldDate.getDate() - date);

        await DBModel.deleteMany({ formatted_date: { "$lt": getUTCTime(oldDate) } });
    } catch (err) {
        console.error('Delete old odd data error: ', err);
    }
}