import express, { Router } from 'express';

import * as controllers from '../controllers/casino.controllers';

const router: Router = express.Router();

// create-user
router.post('/user/create', controllers.createUser);

// casino-list
router.get('/list', controllers.getList);

// casino-info
router.get('/info', controllers.getInfo);

// casino-launch
router.get('/launch', controllers.launch);

// casino Vendors & Types
router.get('/vendor', controllers.getVendors);
router.get('/type', controllers.getTypes);

// balance
router.get('/balance', controllers.getBalance);
router.get('/bet-result', controllers.getBetResult);
router.post('/balance', controllers.updateBalance);
router.post('/changeBalance', controllers.changeBalance);

export default router;
