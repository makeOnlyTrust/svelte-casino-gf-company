import { model, Schema } from 'mongoose';

const HandballOddsSchema = new Schema({
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

const HandballOdds = model('handballOdds', HandballOddsSchema);

export default HandballOdds;
