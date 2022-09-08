import express from 'express';

import { GetUser, GetCurrentUser, UpdateUserDetails, UpdateUserPassword, UpdateUserStatus } from '../controllers/users';

import { UpdateUserDetailsValidator } from '../helpers/validator';

const router = express.Router();

router.get('/me', GetCurrentUser);
router.get('/profile/:user_id', GetUser);
router.put('/update/details', ...UpdateUserDetailsValidator ,UpdateUserDetails);
router.put('/update/password', UpdateUserPassword);
router.put('/update/status', UpdateUserStatus);

module.exports = router;
