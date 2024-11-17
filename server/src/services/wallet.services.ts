// Utils
import { getSocketIO } from '../utils/socket';

// Model
import Wallet from '../models/wallet.model';
import Customer from '../models/customer.model';
import { ObjectId } from "mongodb";
import CryptoRate from "../models/cryptoRate.model";

export const updateWallet = async (userId: string, amount: number, currencyId: string) => {
    try {
        const socket = getSocketIO();
        const user = await Customer.aggregate([
            {
                $match: {
                    "_id": new ObjectId(userId ? userId : 1)
                }
            },
            {
                $lookup: {
                    from: 'wallets',
                    localField: 'walletId',
                    foreignField: '_id',
                    as: 'wallets'
                }
            },
            {
                $unwind: '$wallets'
            },
            {
                $unwind: { path: "$wallets.wallet" }
            },
            {
                $lookup: {
                    from: 'currencies',
                    localField: 'wallets.wallet.currencyId',
                    foreignField: '_id',
                    as: 'currencies'
                }
            },
            {
                $unwind: '$currencies'
            },
            {
                $match: {
                    "currencies._id": new ObjectId(currencyId),
                }
            }
        ]);

        if (user[0].wallets.wallet.balance + amount < 0) {
            return 'nomoney';
        }

        await Wallet.updateOne(
            {
                _id: user[0].walletId,
                'wallet.currencyId': user[0].wallets.wallet.currencyId
            },
            {
                $set: {
                    'wallet.$.balance': user[0].wallets.wallet.balance
                        ? user[0].wallets.wallet.balance + amount
                        : 0,
                },
            }
        );

        const api_key = process.env.EXCHANGE_API_KEY
            ? process.env.EXCHANGE_API_KEY
            : '0';

        const result = await CryptoRate.findOne(
            {
                symbol: user[0].currencies.currencySymbol,
            }
        );

        if(!result || !result.krw) {
            return 'nomoney';
        }


        if (user[0].wallets.casino.currencyId.toString() === user[0].wallets.wallet.currencyId.toString()) {
            await Wallet.updateOne(
                {
                    _id: user[0].walletId
                },
                {
                    $set: {
                        'casino.casinoBalance':
                            user[0].currencies.type === 'crypto'
                                ? result.krw * (user[0].wallets.wallet.balance + amount)
                                : user[0].wallets.wallet.balance + amount,
                        'casino.currencyId': user[0].wallets.wallet.currencyId
                    }
                }
            );
            socket.to(user[0]._id.toString()).emit('gf-wallet-change', {
                success: true,
                balance: user[0].wallets.wallet.balance + amount
            });
        }


        return 'success';
    } catch (e) {
        console.error(e);
        return 'failed'
    }
}
