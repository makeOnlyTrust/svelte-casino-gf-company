import {model, Schema} from 'mongoose';

const promotionSchema = new Schema({
    adminId: {
        type: Schema.Types.ObjectId,
        default: null
    },
    title: String,
    startAt: String,
    endAt: String,
    thumbnail: String,
    html: String,
    isDelete: Boolean
})
const Promotion = model('Promotion', promotionSchema);

export default Promotion;
