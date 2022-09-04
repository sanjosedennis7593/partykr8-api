import express from 'express';

import { TalentSignUpController } from '../controllers/talents';

import { TalentSignupValidator } from '../helpers/validator';

const router = express.Router();

router.post('/signup', ...TalentSignupValidator, TalentSignUpController);


module.exports = router;