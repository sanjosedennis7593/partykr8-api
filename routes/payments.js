import express from 'express';

import { 
    CreateSourcePayment, 
    ConfirmSourcePayment, 
    GetPayments, 
    GetPaymentById,
    GetPaymentIntentById,
    GetSourceById,
    PaymentFailedCallback, 
    PaymentSuccessCallback,
    AttachPaymentIntent,
    CreatePaymentIntent
} from '../controllers/payments';


const router = express.Router();

router.get('/', GetPayments);
router.get('/pay/:id', GetPaymentById);
router.get('/source/:id', GetSourceById);
router.get('/intent/:id', GetPaymentIntentById);
router.post('/event/create', CreateSourcePayment);
router.post('/event/confirm', ConfirmSourcePayment);
router.post('/callback/success', PaymentSuccessCallback);
router.post('/callback/failed', PaymentFailedCallback);
router.post('/intent', CreatePaymentIntent);
router.post('/intent/:payment_intent_id/attach', AttachPaymentIntent);

module.exports = router;
