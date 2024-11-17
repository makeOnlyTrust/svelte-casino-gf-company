import { model, Schema } from 'mongoose';

const SoccerOddsSchema = new Schema({
  id: String,
  league_name: String,
  league_gid: String,
  league_id: String,
  status: String,
  date: String,
  formatted_date: String,
  time: String,
  venue: String,
  static_id: String,
  fix_id: String,
  localteam: Object,
  visitorteam: Object,
  events: String,
  ht: Object,
  odds: Array
});

const SoccerOdds = model('SoccerOdds', SoccerOddsSchema);

export default SoccerOdds;
