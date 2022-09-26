import express from 'express';

import { 
    CreateEvents, 
    GetEvents, 
    GetEvent, 
    UpdateEventTalentStatus, 
    UpdateEventStatus, 
    UpdateEventDetails, 
    SendEventInvite, 
    GetJoinedEvents 
} from '../controllers/events';

// import { UpdateUserDetailsValidator } from '../helpers/validator';

const router = express.Router();

router.get('/', GetEvents);
router.get('/joined', GetJoinedEvents);
router.get('/:id', GetEvent);
router.post('/create', CreateEvents);
router.post('/invite/send', SendEventInvite);
router.put('/details/update', UpdateEventDetails);
router.put('/status/update', UpdateEventStatus);
router.put('/talent/status/update', UpdateEventTalentStatus);


module.exports = router;
