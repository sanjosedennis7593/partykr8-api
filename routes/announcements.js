import express from 'express';

import { 
    CreateAnnouncement, 
    UpdateAnnouncement, 
    DeleteAnnouncement, 
    GetAnnouncements 
} from '../controllers/announcements';

const router = express.Router();

router.get('/', GetAnnouncements);
router.post('/create', CreateAnnouncement);
router.put('/:id/update', UpdateAnnouncement);
router.delete('/:id/delete', DeleteAnnouncement);


module.exports = router;
