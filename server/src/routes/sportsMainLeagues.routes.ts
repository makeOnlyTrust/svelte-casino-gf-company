import express, { Router } from 'express';

import * as sportsMainLeagueController from '../controllers/sportsMainLeagues.controllers';

const router: Router = express.Router();

router.get('/league-id/:id', sportsMainLeagueController.getMainLeagueIdById);

router.get('/league-ids', sportsMainLeagueController.getAllMainLeagueId);

router.post('/add-league-id', sportsMainLeagueController.addMainLeagueId);

router.post('/get-league-id', sportsMainLeagueController.getMainLeagueId);

router.put('/league-id/:id', sportsMainLeagueController.updateMainLeagueId);

export default router;
