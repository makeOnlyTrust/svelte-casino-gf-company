import express, { Router } from 'express';

import * as sportsMainOddNamesController from '../controllers/sportsMainOddNames.controllers';

const router: Router = express.Router();

router.get('/odd-name/:id', sportsMainOddNamesController.getMainOddNameById);

router.get('/odd-names', sportsMainOddNamesController.getAllMainOddNames);

router.post('/add-odd-name', sportsMainOddNamesController.addMainOddName);

router.post('/get-odd-name', sportsMainOddNamesController.getMainOddName);

router.put('/odd-name/:id', sportsMainOddNamesController.updateMainOddName);

export default router;
