import express, { Router } from 'express';

import * as controllers from '../controllers/payment.controllers';

const router: Router = express.Router();

router.get('/', controllers.getPaymentOfCurrency);

export default router;
