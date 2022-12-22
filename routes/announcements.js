import express from 'express';

import {
    CreateAnnouncement,
    UpdateAnnouncement,
    DeleteAnnouncement,
    GetAnnouncements
} from '../controllers/announcements';

import { fileRequest } from '../helpers/upload';

const router = express.Router();


const announcementPhotoRequest = fileRequest.fields([
    { name: 'photos[]', maxCount: 10 }
]);


router.get('/', GetAnnouncements);
router.post('/create', announcementPhotoRequest, CreateAnnouncement);
router.put('/:id/update', announcementPhotoRequest, UpdateAnnouncement);
router.delete('/:id/delete', DeleteAnnouncement);


module.exports = router;
