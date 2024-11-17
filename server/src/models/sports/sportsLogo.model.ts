import { model, Schema } from 'mongoose';

const SportsLogoSchema = new Schema({
  id: String,
  sportsName: String,
  category: String,
  path: String,
});

const SportsLogo = model('SportsLogo', SportsLogoSchema);

export default SportsLogo;
