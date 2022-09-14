import express from 'express';

import { 
    CreateSourcePayment, 
    ConfirmSourcePayment, 
    GetPayments, 
    GetPaymentById,
    GetPaymentIntentById,
    GetSourceById,
    AttachPaymentIntent,
    CreatePaymentIntent
} from '../controllers/payments';


const router = express.Router();

router.get('/', GetPayments);
router.get('/pay/:id', GetPaymentById);
router.get('/source/:id', GetSourceById);
router.get('/intent/:id', GetPaymentIntentById);
router.post('/source/create', CreateSourcePayment);
router.post('/source/confirm', ConfirmSourcePayment);
router.post('/intent', CreatePaymentIntent);
router.post('/intent/:payment_intent_id/attach', AttachPaymentIntent);

module.exports = router;
