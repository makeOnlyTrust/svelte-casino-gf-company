import { model, Schema } from 'mongoose';

const customerDepositTransaction = new Schema({
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    },
    agentId: {
        type: Schema.Types.ObjectId,
        ref: 'Agent',
        default: null
    },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    paymentMethodId: {
        type: Schema.Types.ObjectId,
        ref: 'PaymentMethod'
    },
    orderNumber: String,
    amount: Number,
	bank: {
        type: String,
        default: null
    },
	accountNumber: {
        type: String,
        default: null
    },	
	name: {
        type: String,
        default: null
    },
    fee: Number,
    gamemoney: Number,
    bonus: Number,
    requestsAt: Date,
    responseAt: {
        type: Date,
        default: null
    },
    note: {
        type: String,
        default: null
    },
    status: String
});

const CustomerDepositTransaction = model('CustomerDepositTransaction', customerDepositTransaction);

export default CustomerDepositTransaction;
