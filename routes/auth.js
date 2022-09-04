import express from 'express';

// CONTROLLERS
import { SignInController, SignUpController } from '../controllers/auth';

import { SignupValidator } from '../helpers/validator';


const  router = express.Router();

router.post('/signin', SignInController);
router.post('/signup', ...SignupValidator, SignUpController);


module.exports = router;
