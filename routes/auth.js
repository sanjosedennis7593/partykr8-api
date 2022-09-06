import express from 'express';

// CONTROLLERS
import { FacebookSignIn, FacebookSignInSuccess, FacebookSignInFailed, FacebookSignInCallback, SignInController, SignUpController } from '../controllers/auth';

import { SignupValidator } from '../helpers/validator';


const  router = express.Router();

router.post('/signin', SignInController);
router.post('/signup', ...SignupValidator, SignUpController);
router.get('/signin/facebook', FacebookSignIn);
router.get('/signin/facebook/callback', FacebookSignInCallback);
// router.get('/signin/facebook/success', FacebookSignInSuccess);
// router.get('/signin/facebook/failed', FacebookSignInFailed);

module.exports = router;
