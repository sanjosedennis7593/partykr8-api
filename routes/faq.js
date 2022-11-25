import express from 'express';

import { 
    CreateFaq, 
    UpdateFaq, 
    DeleteFaq, 
    GetFaq 
} from '../controllers/faq';

const router = express.Router();

router.get('/', GetFaq);
router.post('/create', CreateFaq);
router.put('/:id/update', UpdateFaq);
router.delete('/:id/delete', DeleteFaq);


module.exports = router;
