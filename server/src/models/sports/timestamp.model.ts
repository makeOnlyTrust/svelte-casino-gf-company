import { model, Schema } from 'mongoose';

const TimestampSchema = new Schema({
  sportsName: String,
  type: String,
  ts: String,
  updatedAt: Date,
});

const Timestamp = model('Timestamp', TimestampSchema);

export default Timestamp;
