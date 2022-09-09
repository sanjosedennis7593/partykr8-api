import express from 'express';

// CONTROLLERS
import { 
    FacebookSignIn, 
    FacebookSignInCallback, 
    GoogleSignIn, 
    GoogleSignInCallback, 
    SignInController, 
    SignUpController, 
    ResetPassword } from '../controllers/auth';

import { SignupValidator, ResetPasswordValidator } from '../helpers/validator';

const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({ storage });


const  router = express.Router();

router.post('/signin', SignInController);
router.post('/signup', upload.single('profile_photo'), SignupValidator, SignUpController);
router.get('/signin/facebook', FacebookSignIn);
router.get('/signin/facebook/callback', FacebookSignInCallback);
router.get('/signin/google', GoogleSignIn);
router.get('/signin/google/callback', GoogleSignInCallback);
router.post('/forgot/password', ...ResetPasswordValidator, ResetPassword);

module.exports = router;
