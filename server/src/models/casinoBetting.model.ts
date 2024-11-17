import { model, Schema } from 'mongoose';

const casinoBetting = new Schema({
    username: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    amount: {
        type: Number,
        default: 0
    },
    transaction: {
        type: Object
    }
});

const CasinoBetting = model('CasinoBetting', casinoBetting);

export default CasinoBetting;
