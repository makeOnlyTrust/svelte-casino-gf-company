import express, { Router } from 'express';

import * as controllers from '../controllers/crypto.controllers';
import * as middlewares from "../middlewares/account.middlewares";

const router: Router = express.Router();

router.get('/network', controllers.getNetWork);
router.get('/address', middlewares.jwtGaurd, controllers.getAddressByNetwork);
router.get('/rate', controllers.getCryptoRate);

export default router;
