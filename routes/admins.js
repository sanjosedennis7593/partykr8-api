import express from 'express';

import { CreateAdmin, GetAdmins, DeleteAdmin } from '../controllers/admins';

import { AdminCreateValidator } from '../helpers/validator';

const router = express.Router();

router.get('/list', GetAdmins);
router.post('/create', AdminCreateValidator, CreateAdmin);
router.delete('/delete', DeleteAdmin);


module.exports = router;
