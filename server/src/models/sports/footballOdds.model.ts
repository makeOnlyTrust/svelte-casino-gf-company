import { model, Schema } from 'mongoose';

const FootballOddsSchema = new Schema({
  id: String,
  league_name: String,
  league_gid: String,
  league_id: String,
  nflid: String,
  status: String,
  date: String,
  formatted_date: String,
  time: String,
  localteam: Object,
  awayteam: Object,
  odds: Array
});

const FootballOdds = model('footballOdds', FootballOddsSchema);

export default FootballOdds;
