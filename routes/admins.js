import express from 'express';

import { GetAdmins } from '../controllers/admins';

const router = express.Router();

router.get('/list', GetAdmins);

module.exports = router;
