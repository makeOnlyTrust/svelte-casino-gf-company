import { model, Schema } from 'mongoose';

const adminSchema = new Schema({
    parentId: {
        type: Schema.Types.ObjectId,
        default: null
    },
    loginId: String,
    password: String,
    nickname: String,
    profileImage: {
        type: String,
        default:
            'https://storage.goodfriendszone.com/uploads/permanent/newbie.webp'
    },
    createAt: Date,
    lastLogin: Date,
    wallet: String,
    role: String,
    info: {
        commissionMethod: String,
        ggrFee: {
            type: Number,
            default: null
        },
        monthAmount: {
            type: Number,
            default: null
        },
        currencyId: {
            type: Schema.Types.ObjectId,
            ref: 'Currency'
        },
        apiKey: {
            type: String,
            default: null
        },
        verify: {
            otp: Boolean,
            otpCode: String
        }
    }
});

const Admin = model('Admin', adminSchema);

export default Admin;
