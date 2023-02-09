import express from 'express';

// CONTROLLERS
import { 
    FacebookSignIn, 
    // FacebookSignInCallback, 
    GoogleSignIn, 
    GoogleSignInCallback, 
    SignInController, 
    SignUpController, 
    ResetPassword ,
    GetSecurityQuestion,
    AppleSignIn
} from '../controllers/auth';

import { fileRequest } from '../helpers/upload';
import { SignupValidator, ResetPasswordValidator } from '../helpers/validator';

const  router = express.Router();

router.post('/signin', SignInController);
router.post('/signup', fileRequest.single('profile_photo'), SignupValidator, SignUpController);
router.post('/signin/facebook', FacebookSignIn);
// router.get('/signin/facebook/callback', FacebookSignInCallback);
router.post('/signin/google', GoogleSignIn);
router.post('/signin/apple', AppleSignIn);
router.get('/signin/google/callback', GoogleSignInCallback);
router.post('/forgot/password', ...ResetPasswordValidator, ResetPassword);
router.post('/security_question', GetSecurityQuestion);

module.exports = router;
