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
    UpdatePaymentIntentStatus,
    CreatePaypalToken,
    CreatePaypalOrder,
    CapturePaypalOrder,
    GetPaypalOrderDetails,
    RefundPaypalOrder,
    GetPaypalRefundById
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


router.post('/paypal/token/create', CreatePaypalToken);
router.post('/paypal/order/create', CreatePaypalOrder);
router.get('/paypal/order/:order_id', GetPaypalOrderDetails);
router.post('/paypal/order/:order_id/capture', CapturePaypalOrder);
router.post('/paypal/refund/:capture_id', RefundPaypalOrder);
router.get('/paypal/refund/:refund_id', GetPaypalRefundById);

module.exports = router;
