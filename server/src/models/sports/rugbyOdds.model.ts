import { model, Schema } from 'mongoose';

const RugbyOddsSchema = new Schema({
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

const RugbyOdds = model('rugbyOdds', RugbyOddsSchema);

export default RugbyOdds;
