import { model, Schema } from 'mongoose';

const SportsBettingCardsSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    bettingType: {
        type: String,
        enum: ['single', 'multiple']
    },
    bet: [
        {
            sportsName: String,
            leagueId: String,
            matchId: String,
            matchA: Object,
            matchB: Object,
            oddId: String,
            oddName: String,
            subOddName: String,
            oddTarget: String,
            oddValue: String,
        }
    ],
    bettingAmount: Number,
    isWin: Boolean,
    times: Number,
    isCompleted: Boolean,
    createAt: {
        type: Date,
        default: Date.now
    }
});

const SportsBettingCards = model('sportsBettingCards', SportsBettingCardsSchema);

export default SportsBettingCards;
