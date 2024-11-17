import { model, Schema } from 'mongoose';

const minigameActiveSchema = new Schema({
    adminId: {
        type: Schema.Types.ObjectId,
        default: null
    },
    vendor: {
        type: String
    },
    gameId: {
        type: String
    },
    link: {
        type: String
    },
    interval: {
        type: Number
    },
    title: {
        type: String
    },
    thumbnail: {
        type: String
    },
    category: String, //(powerball, ladder, keno)
    status: Boolean,
    startAt: String,
    endAt: String,
    allDay: Boolean,
    betCloseTime: String
})
const MinigameActive = model('MinigameActive', minigameActiveSchema);

export default MinigameActive;
