import { model, Schema } from 'mongoose';

const favoriteSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    gameId: String,
    type: {
        type: String,
        enum: ['sports', 'casino', 'minigame', 'soccer']
    }
});

const Favorite = model('Favorite', favoriteSchema);

export default Favorite;
