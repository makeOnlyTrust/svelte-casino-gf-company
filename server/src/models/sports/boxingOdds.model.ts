import { model, Schema } from 'mongoose';

const BoxingOddsSchema = new Schema({
  id: String,
  league_name: String,
  league_gid: String,
  league_id: String,
  status: String,
  date: String,
  formatted_date: String,
  time: String,
  localteam: Object,
  awayteam: Object,
  odds: Array
});

const BoxingOdds = model('boxingOdds', BoxingOddsSchema);

export default BoxingOdds;
