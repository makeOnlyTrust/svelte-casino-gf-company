import { model, Schema } from 'mongoose';

const EsportsOddsSchema = new Schema({
  id: String,
  league_name: String,
  league_gid: String,
  league_id: String,
  status: String,
  date: String,
  formatted_date: String,
  time: String,
  static_id: String,
  fix_id: String,
  localteam: Object,
  visitorteam: Object,
  events: String,
  odds: Array
});

const EsportsOdds = model('esportsOdds', EsportsOddsSchema);

export default EsportsOdds;
