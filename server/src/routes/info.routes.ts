import express, { Router } from 'express';

import * as controllers from '../controllers/info.controllers';
import * as middlewares from "../middlewares/account.middlewares";

const router: Router = express.Router();

// total win
router.post('/total/win', middlewares.jwtGaurd, controllers.getTotalWin);
// total bet
router.post('/total/bet', middlewares.jwtGaurd, controllers.getTotalBet);
// total wagered
router.post('/total/wagered', middlewares.jwtGaurd, controllers.getTotalWagered);
// total top game
router.post('/top', middlewares.jwtGaurd, controllers.getTop3Game);

export default router;
