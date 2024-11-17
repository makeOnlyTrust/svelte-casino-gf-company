import { model, Schema } from 'mongoose';

const RugbyLeagueOddsSchema = new Schema({
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

const RugbyLeagueOdds = model('rugbyLeagueOdds', RugbyLeagueOddsSchema);

export default RugbyLeagueOdds;
