import express, { Router } from 'express';

import * as controllers from '../controllers/casinoBetting.controllers';

const router: Router = express.Router();

router.get('/', controllers.getCasinoBettingList);

export default router;
