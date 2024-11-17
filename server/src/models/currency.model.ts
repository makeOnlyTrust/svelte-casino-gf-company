import { model, Schema } from 'mongoose';

const currencySchema = new Schema({
    name: String,
    image: String,
    currencySymbol: String,
    type: {
        type: String,
        enum: ['fiat', 'crypto']
    },
    network: {}
});

const Currency = model('Currency', currencySchema);

export default Currency;
