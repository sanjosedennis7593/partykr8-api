import express from 'express';

import { CreateEvents, GetEvents, GetEvent, UpdateEventTalentStatus, UpdateEventStatus, UpdateEventDetails } from '../controllers/events';

// import { UpdateUserDetailsValidator } from '../helpers/validator';

const router = express.Router();

router.get('/', GetEvents);
router.get('/:id', GetEvent);
router.post('/create', CreateEvents);
router.put('/details/update', UpdateEventDetails);
router.put('/status/update', UpdateEventStatus);
router.put('/talent/status/update', UpdateEventTalentStatus);


module.exports = router;
