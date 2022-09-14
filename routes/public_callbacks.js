import express from 'express';

import { 
    PaymentFailedCallback, 
    PaymentSuccessCallback,
} from '../controllers/payments';


const router = express.Router();

router.get('/payment/success', PaymentSuccessCallback);
router.get('/payment/failed', PaymentFailedCallback);
module.exports = router;
