import { model, Schema } from 'mongoose';

const cryptoNetworkSchema = new Schema({
    currencyId: String,
    currencySymbol: String,
    network: Array,
    address: Array
});

const CryptoNetwork = model('cryptoNetwork', cryptoNetworkSchema);

export default CryptoNetwork;
