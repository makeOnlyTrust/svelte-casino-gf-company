import express, { Router } from 'express';

import * as controllers from '../controllers/withdrawal.controllers';

const router: Router = express.Router();

router.post('/crypto/user', controllers.createWithdrawalTransactions)
router.post('/fiat/user', controllers.createWithdrawalTransactions)
router.get('/condition', controllers.getWithdrawalConditions);

export default router;
