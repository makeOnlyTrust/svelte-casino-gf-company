import { model, Schema } from 'mongoose';

const TableTennisOddsSchema = new Schema({
  id: String,
  league_name: String,
  league_gid: String,
  league_id: String,
  tb: String,
  time: String,
  formatted_date: String,
  status: String,
  player_1: Object,
  player_2: Object,
  odds: Array
});

const TableTennisOdds = model('tableTennisOdds', TableTennisOddsSchema);

export default TableTennisOdds;
