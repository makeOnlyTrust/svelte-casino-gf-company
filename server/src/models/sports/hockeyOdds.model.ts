import { model, Schema } from 'mongoose';

const HockeyOddsSchema = new Schema({
  id: String,
  league_name: String,
  league_gid: String,
  league_id: String,
  nhlid: String,
  fix_id: String,
  status: String,
  date: String,
  formatted_date: String,
  time: String,
  localteam: Object,
  awayteam: Object,
  events: Object,
  odds: Array
});

const HockeyOdds = model('HockeyOdds', HockeyOddsSchema);

export default HockeyOdds;