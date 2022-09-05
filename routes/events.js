import express from 'express';

import { CreateEvents, GetEvents } from '../controllers/events';

// import { UpdateUserDetailsValidator } from '../helpers/validator';

const router = express.Router();

router.get('/', GetEvents);
router.post('/create', CreateEvents);


module.exports = router;
