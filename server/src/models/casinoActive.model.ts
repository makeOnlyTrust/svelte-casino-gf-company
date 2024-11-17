import { model, Schema } from 'mongoose';

const casinoActiveSchema = new Schema({
    adminId: {
        type: Schema.Types.ObjectId,
        default: null
    },
    vendor: {
        type: String
    },
    status: Boolean
})
const CasinoActive = model('CasinoActive', casinoActiveSchema);

export default CasinoActive;
