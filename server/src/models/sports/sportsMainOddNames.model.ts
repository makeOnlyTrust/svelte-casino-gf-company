import { model, Schema } from 'mongoose';

const SportsMainOddNamesSchema = new Schema({
  sportsName: String,
  type: String,
  odd1: String,
  odd2: String,
  odd3: String
});

const SportsMainOddNames = model('sportsMainOddNames', SportsMainOddNamesSchema);

export default SportsMainOddNames;
