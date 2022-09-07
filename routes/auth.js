import express from 'express';

// CONTROLLERS
import { FacebookSignIn, FacebookSignInCallback, SignInController, SignUpController, ResetPassword } from '../controllers/auth';

import { SignupValidator, ResetPasswordValidator } from '../helpers/validator';


const  router = express.Router();

router.post('/signin', SignInController);
router.post('/signup', ...SignupValidator, SignUpController);
router.get('/signin/facebook', FacebookSignIn);
router.get('/signin/facebook/callback', FacebookSignInCallback);
// router.get('/signin/facebook/success', FacebookSignInSuccess);
// router.get('/signin/facebook/failed', FacebookSignInFailed);
router.post('/forgot/password', ...ResetPasswordValidator, ResetPassword);

module.exports = router;
