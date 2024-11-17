import { model, Schema } from 'mongoose';
import { ObjectId } from "mongodb";

const cryptoRateSchema = new Schema({
    _id: ObjectId,
    id: String,
    krw: Number,
    last_updated: Date,
    symbol: String,
});

const CryptoRate = model('cryptoRate', cryptoRateSchema);

export default CryptoRate;
