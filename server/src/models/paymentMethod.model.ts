import { model, Schema } from 'mongoose';

const paymentMethodSchema = new Schema({
    currencyId: {
        type: Schema.Types.ObjectId,
        ref: 'Currency'
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'admin'
    },
    symbol: String, 
    name: String,
    logo: String,
    depositForm: [],
    withdrawalForm: [],
    deposit: {
        feePercent: Number,
        feePerTransaction: Number,
        min: Number,
        max: Number
    },
    withdrawal: {
        feePercent: Number,
        feePerTransaction: Number,
        min: Number, //-1 no limit
        max: Number, 
    },
});

const PaymentMethod = model('PaymentMethod', paymentMethodSchema);

export default PaymentMethod;
