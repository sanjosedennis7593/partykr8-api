import express from 'express';

// CONTROLLERS
import { SignInController, SignUpController } from '../controllers/auth';


const  router = express.Router();

router.post('/signin', SignInController);
router.post('/signup', SignUpController);


module.exports = router;
