import { model, Schema } from 'mongoose';

const GolfOddsSchema = new Schema({
  id: String,
  league_name: String,
  league_gid: String,
  league_id: String,
  date: String,
  formatted_date: String,
  time: String,
  localteam: Object,
  awayteam: Object,
  odds: Array
});

const GolfOdds = model('golfOdds', GolfOddsSchema);

export default GolfOdds;
