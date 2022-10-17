import express from 'express';

import { 
    GetTalent, 
    GetTalents, 
    TalentSignUp,
    TalentUpdateStatus, 
    TalentUpdateAvatar,
    CreateTalentDetailsRequest,
    UpdateTalentDetailsRequest,
    GetTalentDetailsRequest,
    GetTalentEvents,
    CreateTalentRating,
    GetTalentRatings,
    GetServiceCounts,
    UpdateTalentPayout,
    GetTalentPayout,
    TalentPackageUpdate
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
    { name: 'talent_photos[]', maxCount: 5 },
    { name: 'valid_ids[]', maxCount: 3 }
]);

const avatarRequest = fileRequest.fields(avatarUrlRequests);


router.get('/', GetTalents);
router.get('/counts', GetServiceCounts);
router.get('/payouts/:talent_id', GetTalentPayout);
router.get('/:id', GetTalent);
router.get('/:id/events', GetTalentEvents);
router.get('/:id/ratings', GetTalentRatings);
router.get('/details/request', GetTalentDetailsRequest);
router.post('/signup', signupAvatarRequest, TalentSignupValidator, TalentSignUp);
router.put('/status/update', TalentUpdateStatus);
router.put('/payout/update', UpdateTalentPayout);
router.put('/avatar/update', avatarRequest, TalentUpdateAvatar);
router.put('/package/update', TalentPackageUpdate);
router.post('/details/request', CreateTalentDetailsRequest);
router.put('/details/request/update', UpdateTalentDetailsRequest);
router.post('/ratings/create', CreateTalentRating);


module.exports = router;