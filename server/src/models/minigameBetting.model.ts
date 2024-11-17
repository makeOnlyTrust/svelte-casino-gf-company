import { model, Schema } from 'mongoose';

const minigameBettingSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    currencyId: {
        type: Schema.Types.ObjectId,
        ref: 'Currency'
    },
    amount: {
        type: Number
    },
    isChecked: {
        type: Boolean
    },
    checkedId: {
        type: Schema.Types.ObjectId,
        default: null,
    },
    transactions: {
        id: {
            type: Number
        }, // timestamp
        txType: {
            type: String
        }, // “bet”, “win”
        refererId: {
            type: Number,
            default: null
        },
        amount: {
            type: Number
        },
        processedAt: {
            type: Date
        },
    },
    details: {
        gameId: {
            type: String,
            ref: 'MinigameList'
        },
        index: {
            type: String
        },
        bet: {
            type: Schema.Types.Mixed
        },
        amount: {
            type: Number
        },
        multiplier: {
            type: Number
        }
    }

})
const MinigameBetting = model('MinigameBetting', minigameBettingSchema);

export default MinigameBetting;
