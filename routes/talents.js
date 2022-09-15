import express from 'express';

import { 
    GetTalent, 
    GetTalents, 
    TalentSignUp,
    TalentUpdateStatus, 
    TalentUpdateAvatar,
    CreateTalentRateRequest,
    UpdateTalentRateRequest,
    GetTalentRateRequest
} from '../controllers/talents';

import { fileRequest } from '../helpers/upload';
import { TalentSignupValidator } from '../helpers/validator';

const router = express.Router();

const avatarUrlRequests = [
    { name: 'avatar_url_1', maxCount: 1 }, 
    { name: 'avatar_url_2', maxCount: 1 }, 
    { name: 'avatar_url_3', maxCount: 1 }
];

const signupAvatarRequest = fileRequest.fields([
    ...avatarUrlRequests,
    { name: 'valid_ids', maxCount: 3 }
]);

const avatarRequest = fileRequest.fields(avatarUrlRequests);


router.get('/', GetTalents);
router.get('/:id', GetTalent);
router.get('/rate/request', GetTalentRateRequest);
router.post('/signup', signupAvatarRequest, TalentSignupValidator, TalentSignUp);
router.put('/status/update', TalentUpdateStatus);
router.put('/avatar/update', avatarRequest, TalentUpdateAvatar);
router.post('/rate/request', CreateTalentRateRequest);
router.put('/rate/request/update', UpdateTalentRateRequest);



module.exports = router;