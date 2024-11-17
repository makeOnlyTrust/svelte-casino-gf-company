import { model, Schema } from 'mongoose';

const BaseballOddsSchema = new Schema({
  id: String,
  league_name: String,
  league_gid: String,
  league_id: String,
  mlbid: String,
  status: String,
  date: String,
  formatted_date: String,
  time: String,
  localteam: Object,
  awayteam: Object,
  starting_pitchers: Object,
  odds: Array
});

const BaseballOdds = model('baseballOdds', BaseballOddsSchema);

export default BaseballOdds;
