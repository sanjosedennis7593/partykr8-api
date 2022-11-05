import express from 'express';

import { 
    PaymentFailedCallback, 
    PaymentSuccessCallback,
    PaymentCancelCallback
} from '../controllers/payments';


const router = express.Router();

router.get('/payment/success', PaymentSuccessCallback);
router.get('/payment/failed', PaymentFailedCallback);
router.get('/payment/cancel', PaymentCancelCallback);

module.exports = router;
