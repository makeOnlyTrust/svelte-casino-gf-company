import express, {Router} from 'express';

import * as controllers from '../controllers/promotion.controllers';
import * as middlewares from "../middlewares/account.middlewares";

const router: Router = express.Router();

// promotion not close list
router.get('/', controllers.promotionList);
// promotion close list
router.get('/close', controllers.promotionCloseList);
// get promotion detail
router.post('/detail', controllers.promotionDetail);


export default router;
