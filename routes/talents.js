import express from 'express';

import { GetTalents, TalentSignUpController, TalentUpdateStatus } from '../controllers/talents';

import { TalentSignupValidator } from '../helpers/validator';

const router = express.Router();

router.get('/', GetTalents);
router.post('/signup', ...TalentSignupValidator, TalentSignUpController);
router.put('/update/status', TalentUpdateStatus);



module.exports = router;