import mongoose from 'mongoose';

import { getGameList } from '../services/api/casinoApi.services';

import CasinoList from '../models/casinoList.model';
import Currency from '../models/currency.model';
import Favorite from '../models/favorite.model';
import Agent from '../models/agent.model';
import paymentMethod from '../models/paymentMethod.model';
import cryptoNetwork from '../models/cryptoNetwork.model';
import casinoBetting from '../models/casinoBetting.model';
import sportsMainLeagueModel from '../models/sports/sportsMainLeagues.model';
import SportsMainOddNamesModel from '../models/sports/sportsMainOddNames.model';

import data from '../config/data.json';

const mongoURL: string = String(process.env.mongoURL);

export const connectDB = async () => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(mongoURL)
            .then(async () => {
                console.log('MongoDB connected!');

                // CasinoList.exists({}).then(async (exists) => {
                //     if (!exists) {
                //         const gameList = await getGameList();
                //         await CasinoList.insertMany(gameList);
                //     }
                // })

                const isExistCurrency = await Currency.exists({})
                if (!isExistCurrency) {
                    await Currency.insertMany(data.currency);
                }

                cryptoNetwork.exists({}).then(async (exists) => {
                    if (!exists) {
                        let currencyList = await Currency.find({})
                        let data_: any = data.cryptoNetwork
                        let index_ = 0;
                        currencyList.map((item: any, index) => {
                            if (item.type == 'crypto') {
                                data_[index_]['currencyId'] = item._id.toJSON();
                                index_++;
                            }
                        })
                        await cryptoNetwork.insertMany(data_);
                    }
                })

                // Favorite.exists({}).then(async (exists) => {
                //     if (!exists) {
                //         await Favorite.insertMany(data.favorite);
                //     }
                // })
                // Agent.exists({}).then(async (exists) => {
                //     if (!exists) {
                //         await Agent.insertMany(data.agent);
                //     }
                // })
                paymentMethod.exists({}).then(async (exists) => {
                    if (!exists) {
                        await paymentMethod.insertMany(data.paymentMethod);
                    }
                });

                // casinoBetting.exists({}).then(async (exists) => {
                //     if(!exists) {
                //         await casinoBetting.insertMany(data.casinoBetting);
                //     }
                // })

                sportsMainLeagueModel.exists({}).then(async (exists) => {
                    if(!exists) {
                        await sportsMainLeagueModel.insertMany(data.mainLeagueId);
                    }
                })

                SportsMainOddNamesModel.exists({}).then(async (exists) => {
                    if(!exists) {
                        await SportsMainOddNamesModel.insertMany(data.mainOddNames);
                    }
                })

                resolve('');
            })
            .catch((err) => {
                console.log(err);
                reject();
            });
    });
};
