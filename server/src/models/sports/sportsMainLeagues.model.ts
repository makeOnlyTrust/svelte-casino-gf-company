import { model, Schema } from 'mongoose';

const SportsMainLeagueSchema = new Schema({
  sportsName: String,
  type: String,
  leagueId: String,
});

const SportsMainLeague = model('sportsMainLeague', SportsMainLeagueSchema);

export default SportsMainLeague;
