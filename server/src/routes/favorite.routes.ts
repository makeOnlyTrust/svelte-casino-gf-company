import express, { Router } from 'express';

import * as controllers from '../controllers/favorite.controllers';

const router: Router = express.Router();

router.post('/create', controllers.createFavorite);
router.post('/delete', controllers.deleteFavorite);

router.get('/', controllers.getFavoriteList);

export default router;
