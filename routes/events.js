import express from 'express';

import { 
    CreateEvents, 
    GetEvents, 
    GetEvent, 
    UpdateEventTalentStatus, 
    UpdateEventStatus, 
    UpdateEventDetails, 
    SendEventInvite, 
    GetJoinedEvents, 
    GetAllEventsByStatus,
    GetEventTalents,
    UpdateEventTalents,
    GetCustomEventTypes
} from '../controllers/events';

// import { UpdateUserDetailsValidator } from '../helpers/validator';

const router = express.Router();

router.get('/', GetEvents);
router.get('/joined', GetJoinedEvents);
router.get('/talents', GetEventTalents);
router.get('/type', GetCustomEventTypes);
router.get('/status/:status', GetAllEventsByStatus);
router.get('/:id', GetEvent);
router.post('/create', CreateEvents);
router.post('/invite/send', SendEventInvite);
router.put('/details/update', UpdateEventDetails);
router.put('/status/update', UpdateEventStatus);
router.put('/talents', UpdateEventTalents);
router.put('/talent/status/update', UpdateEventTalentStatus);


module.exports = router;
