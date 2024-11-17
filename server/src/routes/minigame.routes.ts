import express, { Router } from 'express';
import * as controllers from '../controllers/minigame.controllers';
import * as middlewares from '../middlewares/account.middlewares';

const router: Router = express.Router();

//minigame list
router.get('/list', controllers.getGameList);
//minigame info
router.get('/info', controllers.getGameInfo);
//minigame vendor list
router.get('/vendor', controllers.getMinigameVendorList);
//minigame betting result
router.get('/result', controllers.getGameResult);
//minigame betting result list
router.get('/result/list', controllers.getGameResultList);
//minigame betting
router.post('/bet', middlewares.jwtGaurd, controllers.postMinigameBet);
//minigame get betting rate
router.post('/bet/rate', controllers.getBetRate);
//minigame betting history
router.get('/bet/history', controllers.getBetHistoryList);

export default router;
