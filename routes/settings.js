import express from 'express';

import { 
    GetFeatures, 
    UpdateFeatures,
} from '../controllers/settings';


const router = express.Router();

router.get('/features', GetFeatures);
router.put('/features', UpdateFeatures);

module.exports = router;
