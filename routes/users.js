import express from 'express';

import { GetCurrentUser } from '../controllers/users';

const router = express.Router();

router.get('/me', GetCurrentUser);

module.exports = router;
