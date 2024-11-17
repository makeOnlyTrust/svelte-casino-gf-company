import { model, Schema } from 'mongoose';

const authCodeSchema = new Schema({
    code: String,
    regDate: Date,
    isUsed: Boolean
});

const AuthCode = model('AuthCode', authCodeSchema);

export default AuthCode;
