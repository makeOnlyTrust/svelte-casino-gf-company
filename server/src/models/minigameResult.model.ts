import { model, Schema } from 'mongoose';

const minigameResultSchema = new Schema({
    date: {
        type: String
    },
    gameId: {
        type: String,
    },
    index: {
        type: String
    },
    time: {
        type: String
    },
    title: {
        type: String
    },
    vendor: {
        type: String
    },
    result: {
        type: Schema.Types.Mixed
    }
})

const MinigameResult = model('MinigameResult', minigameResultSchema);

export default MinigameResult;
