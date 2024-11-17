import { model, Schema } from 'mongoose';

const walletSchema = new Schema({
    wallet: [
        {
            currencyId: {
                type: Schema.Types.ObjectId,
                ref: 'Currency',
                default: null
            },
            balance: {
                type: Number,
                default: 0
            }
        }
    ],
    casino: {
        casinoBalance: {
            type: Number,
            default: 0
        },
        currencyId: {
            type: Schema.Types.ObjectId,
            ref: 'Currency',
            default: null
        }
    }
});

const Wallet = model('Wallet', walletSchema);

export default Wallet;
