import express, { Router } from 'express';

import * as sportsController from '../controllers/sports.controllers';

const router: Router = express.Router();

router.get('/get-main-odds', sportsController.getMainOdds);

// Get sports odd by match ID
router.post('/get-match/:sports', sportsController.getMatchById);

// Get sports odds
router.get('/get-matches/:sports', sportsController.getMatches);

// Get leagues
router.post('/get-league-list/:sports', sportsController.getLeagueList);

// Get matches by league id
router.post('/get-metches-by-league/:sports', sportsController.getMatchesByLeagueId);


// Get league id list
router.get('/get-leagueids', sportsController.getLeagueIds);

// Get league season list
router.get('/get-league-season', sportsController.getLeagueSeasons);

// Get fixture by league ID
router.post('/get-fixture', sportsController.getFixture);

// Get team abbreviations
router.get('/get-team-abbr', sportsController.getTeamAbbr);

// Get history by league ID
router.post('/get-history', sportsController.getHistory);

// Get teams/players by leagueID
router.post('/get-league', sportsController.getLeague);

// Get commentaries
router.post('/get-commentary', sportsController.getCommentary);

// Get injury
router.get('/get-injury', sportsController.getInjury);

// Get video highlight
router.post('/get-video-highlight', sportsController.getHighlight);

// Get standing
router.post('/get-standing', sportsController.getStanding);

// Get topscores
router.post('/get-topscore', sportsController.getTopscore);

// Get profiles/stats
router.post('/get-soccer-stats', sportsController.getSoccerStats);

// Get soccer h2h
router.post('/get-h2h', sportsController.getHTwoH);

export default router;
