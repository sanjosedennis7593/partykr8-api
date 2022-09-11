import express from 'express';

import { GetUser, GetCurrentUser, UpdateUserAvatar, UpdateUserDetails, UpdateUserPassword, UpdateUserStatus } from '../controllers/users';

import { fileRequest } from '../helpers/upload';
import { UpdateUserDetailsValidator } from '../helpers/validator';

const router = express.Router();

router.get('/me', GetCurrentUser);
router.get('/profile/:user_id', GetUser);
router.put('/details/update', ...UpdateUserDetailsValidator ,UpdateUserDetails);
router.put('/password/update', UpdateUserPassword);
router.put('/status/update', UpdateUserStatus);
router.put('/avatar/update', fileRequest.single('profile_photo'), UpdateUserAvatar);

module.exports = router;
