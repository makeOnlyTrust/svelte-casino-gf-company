import express, { Router } from 'express';

import * as controllers from '../controllers/account.controllers';
import * as middlewares from '../middlewares/account.middlewares';

const router: Router = express.Router();

// social sign-up
router.post('/social/sign-up', middlewares.emailCheck, controllers.socialSignUp);

// sign-in
router.post('/sign-in', controllers.signIn);
router.post('/sign-in/success', middlewares.jwtGaurd, controllers.signInSuccess);
router.post('/sign-in/refresh', controllers.refresh);

// sign-out
router.post('/sign-out', controllers.signOut);

// profile
router.post('/profile/image', controllers.changeProfileImage);
router.post('/profile/nick', controllers.changeNick);

// send
router.post('/email', controllers.sendEmail);
router.post('/sms', controllers.sendPhone);

// check
router.post('/email-check', controllers.emailCheck);
router.post('/phone-check', controllers.phoneCheck);

// get Currency List
router.get('/wallet', middlewares.jwtGaurd, controllers.getWallet);
// get network list by selected currency
router.post('/get-network', controllers.getNetwork);

// agent code add
router.post('/agent-code', controllers.agentCodeAdd);

export default router;
