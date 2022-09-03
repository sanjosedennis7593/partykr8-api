import express from 'express';

import { GetCurrentUser, UpdateUserDetails, UpdateUserPassword } from '../controllers/users';

const router = express.Router();

router.get('/me', GetCurrentUser);
router.put('/update/details', UpdateUserDetails);
router.put('/update/password', UpdateUserPassword);

module.exports = router;
