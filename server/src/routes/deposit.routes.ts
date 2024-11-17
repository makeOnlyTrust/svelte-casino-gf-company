import express, { Router } from 'express';

import * as controllers from '../controllers/deposit.controllers';

const router: Router = express.Router();

router.post('/fiat/user', controllers.createDepositTransaction);
router.get('/transactions', controllers.getTransactions)

export default router;
