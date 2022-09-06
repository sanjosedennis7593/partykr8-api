import express from 'express';

import { CreateEvents, GetEvents, UpdateEventTalentStatus } from '../controllers/events';

// import { UpdateUserDetailsValidator } from '../helpers/validator';

const router = express.Router();

router.get('/', GetEvents);
router.post('/create', CreateEvents);
router.put('/talent/status/update', UpdateEventTalentStatus);


module.exports = router;
