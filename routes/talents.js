import express from 'express';

import { GetTalents, TalentSignUpController, TalentUpdateStatus } from '../controllers/talents';

import { fileRequest } from '../helpers/upload';
import { TalentSignupValidator } from '../helpers/validator';

const router = express.Router();

const signupAvatarRequest = fileRequest.fields([
    { name: 'avatar_url_1', maxCount: 1 }, 
    { name: 'avatar_url_2', maxCount: 1 }, 
    { name: 'avatar_url_3', maxCount: 1 },
    { name: 'valid_ids', maxCount: 3 }
]);

router.get('/', GetTalents);
router.post('/signup', signupAvatarRequest, TalentSignupValidator, TalentSignUpController);
router.put('/status/update', TalentUpdateStatus);



module.exports = router;