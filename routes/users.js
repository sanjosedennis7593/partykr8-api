import express from 'express';

import { GetCurrentUser, UpdateUserDetails, UpdateUserPassword } from '../controllers/users';

import { UpdateUserDetailsValidator } from '../helpers/validator';

const router = express.Router();

router.get('/me', GetCurrentUser);
router.put('/update/details', ...UpdateUserDetailsValidator ,UpdateUserDetails);
router.put('/update/password', UpdateUserPassword);

module.exports = router;
