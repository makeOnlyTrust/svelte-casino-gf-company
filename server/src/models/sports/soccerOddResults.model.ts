import { model, Schema } from 'mongoose';

const SoccerOddResultsSchema = new Schema({
  id: String,
  league_name: String,
  league_gid: String,
  league_id: String,
  league_file_group: String,
  league_iscup: String,
  status: String,
  timer: String,
  date: String,
  formatted_date: String,
  time: String,
  commentary_available: String,
  venue: String,
  v: String,
  static_id: String,
  fix_id: String,
  localteam: Object,
  visitorteam: Object,
  events: Object,
  ht: Object,
  ft: Object,
  et: Object,
  penalty: Object
});

const SoccerOddResults = model('SoccerOddResults', SoccerOddResultsSchema);

export default SoccerOddResults;
