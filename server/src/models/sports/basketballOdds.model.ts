import { model, Schema } from 'mongoose';

const BasketballOddsSchema = new Schema({
  id: String,
  league_name: String,
  league_gid: String,
  league_id: String,
  nbaid: String,
  status: String,
  date: String,
  formatted_date: String,
  time: String,
  localteam: Object,
  awayteam: Object,
  odds: Array
});

const BasketballOdds = model('BasketballOdds', BasketballOddsSchema);

export default BasketballOdds;
