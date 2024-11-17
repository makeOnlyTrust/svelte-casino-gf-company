import express, { Router } from 'express';

import * as sportsBettingCardsController from '../controllers/sportsBettingCards.controllers';

const router: Router = express.Router();

router.get('/betting-card/:id', sportsBettingCardsController.getBettingCardById);

router.post('/betting-card-by-type', sportsBettingCardsController.getBettingCardByType);

router.get('/betting-cards', sportsBettingCardsController.getAllBettingCards);

router.post('/betting-cards', sportsBettingCardsController.getBettingCards);

router.post('/add-single-betting-cards', sportsBettingCardsController.addSingleBettingCards);

router.post('/add-multiple-betting-cards', sportsBettingCardsController.addMultipleBettingCards);

export default router;
