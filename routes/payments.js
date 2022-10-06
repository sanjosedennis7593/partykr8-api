import express from 'express';

import { 
    CreateSourcePayment, 
    ConfirmSourcePayment, 
    GetPayments, 
    GetPaymentById,
    GetPaymentIntentById,
    GetSourceById,
    AttachPaymentIntent,
    CreatePaymentIntent,
    CreateRefund,
    GetRefundById,
    GetRefunds,
    UpdatePaymentIntentStatus
} from '../controllers/payments';


const router = express.Router();

router.get('/', GetPayments);
router.get('/pay/:id', GetPaymentById);
router.get('/source/:id', GetSourceById);
router.put('/intent/status', UpdatePaymentIntentStatus);
router.get('/intent/:id', GetPaymentIntentById);
router.get('/refunds', GetRefunds);
router.get('/refund/:id', GetRefundById);
router.post('/source/create', CreateSourcePayment);
router.post('/source/confirm', ConfirmSourcePayment);
router.post('/intent', CreatePaymentIntent);
router.post('/intent/:payment_intent_id/attach', AttachPaymentIntent);
router.post('/refund', CreateRefund);


module.exports = router;
