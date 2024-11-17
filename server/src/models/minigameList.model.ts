import { model, Schema } from 'mongoose';

const minigameListSchema = new Schema({
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
    category: String //(powerball, ladder, keno)
})
const MinigameList = model('MinigameList', minigameListSchema);

export default MinigameList;
