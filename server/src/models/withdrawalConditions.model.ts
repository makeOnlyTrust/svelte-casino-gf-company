import { model, Schema } from 'mongoose';

const withdrawalConditionsSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        default: null
    },
    currencyId: {
        type: Schema.Types.ObjectId,
        ref: 'Currency',
        default: null
    },
    totalDeposited: {
        type: Number,
        default: 0
    },
    totalUsed: {
        type: Number,
        default: 0
    }
});

const WithdrawalConditions = model('WithdrawalConditions', withdrawalConditionsSchema);

export default WithdrawalConditions;