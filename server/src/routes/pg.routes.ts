
import express, { Router } from 'express';
import * as controllers from '../controllers/pg.controllers';

const router: Router = express.Router();

/////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////// GFPAY /////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/gfpay/issuance', controllers.GFpayIssuanceUrl);
router.post('/gfpay/callback/deposit', controllers.GFpayDepositCallback);
router.post('/gfpay/withdrawal', controllers.GFpayWithdrawalRequest)
// router.post('/gfpay/callback/withdrawal', controllers.GFpayWithdrawalCallback);

export default router;