import {
    createPayment,
    createPaymentIntent,
    createPaymentSource,
    confirmPaymentIntent,
    createRefund,
    listPayments,
    listRefunds,
    retrievePaymentById,
    retrievePaymentSource,
    rerievePaymentIntentById,
    retrieveRefundById
} from '../services/payment';

import Table from '../helpers/database';

import db from '../models';


const Events = new Table(db.events);
const EventPayments = new Table(db.event_payments);
const EventPaymentDetails = new Table(db.event_payment_details);
const EventRefund = new Table(db.event_refund);

const GetPayments = async (req, res, next) => {

    try {
        const payments = await listPayments();

        return res.status(201).json({
            data: payments
        });
    }
    catch (err) {
        console.log('Error ', err.response.data)
        return res.status(400).json({
            error: err.code,
            message: err.response.data
        });
    }
};


const CreateSourcePayment = async (req, res, next) => {

    try {
        const {
            amount,
            billing_name,
            billing_phone,
            billing_email,
            payment_type,
            event_id
        } = req.body;


        const eventPaymentResponse = await createPaymentSource({
            amount,
            billing_name,
            billing_phone,
            billing_email,
            type: payment_type,
            event_id
        });

        await EventPayments.CREATE(
            {
                event_id,
                amount,
                type: 'source',
                ref_id: eventPaymentResponse && eventPaymentResponse.data && eventPaymentResponse.data.id,
                payment_type: payment_type,
                status: eventPaymentResponse && eventPaymentResponse.data && eventPaymentResponse.data.attributes && eventPaymentResponse.data.attributes.status,
            }
        );

        return res.status(201).json({
            message: 'Payment source has been created successfully!',
            data: eventPaymentResponse && eventPaymentResponse.data
        });
    }
    catch (err) {
        console.log('Error ', err.response.data)
        return res.status(400).json({
            error: err.code,
            message: err.response.data
        });
    }
};


const ConfirmSourcePayment = async (req, res, next) => {

    try {

        const {
            id,
            type,
            amount,
            description,
            event_id,
            payment_intent_id,
            selected_talent = []
        } = req.body;

        const eventPaymentResponse = await createPayment({
            id,
            type,
            amount,
            description
        });


        await EventPayments.UPSERT(
            {
                event_id
            },
            {
                amount,
                event_id,
                payment_id: eventPaymentResponse && eventPaymentResponse.data && eventPaymentResponse.data.id,
                status: eventPaymentResponse && eventPaymentResponse.data && eventPaymentResponse.data.attributes && eventPaymentResponse.data.attributes.status
            }
        );


        const currentEventPayment = await EventPayments.GET(
            {
                where: {
                    event_id,
                    ref_id: payment_intent_id
                }
            }
        );


        if (currentEventPayment && currentEventPayment.dataValues) {

            for (let talent of selected_talent) {
                await EventPaymentDetails.CREATE({
                    event_id,
                    event_payment_id: currentEventPayment.dataValues.event_payment_id,
                    talent_id: talent.talent_id,
                    amount: talent.amount_paid,
                    status: 1
                })
            }

        }



        return res.status(201).json({
            message: 'Payment has been confirm successfully!',
            data: eventPaymentResponse,
            event_id
        });
    }
    catch (err) {
        console.log('Error ', err)
        return res.status(400).json({
            error: err.code,
            message: err.response.data
        });
    }
};


const GetPaymentById = async (req, res, next) => {

    try {
        const {
            id
        } = req.params;

        const eventPaymentResponse = await retrievePaymentById(id);

        return res.status(201).json({
            data: eventPaymentResponse
        });
    }
    catch (err) {
        console.log('Error ', err.response.data)
        return res.status(400).json({
            error: err.code,
            message: err.response.data
        });
    }
};


const GetSourceById = async (req, res, next) => {

    try {
        const {
            id
        } = req.params;

        const eventPaymentResponse = await retrievePaymentSource(id);

        return res.status(201).json({
            data: eventPaymentResponse
        });
    }
    catch (err) {
        console.log('Error ', err.response.data)
        return res.status(400).json({
            error: err.code,
            message: err.response.data
        });
    }
};


const UpdatePaymentIntentStatus = async (req, res, next) => {
    try {
        const { payment_intent_id, event_id, payment_id } = req.body;

        await EventPayments.UPSERT(
            {
                ref_id: payment_intent_id,
                event_id
            },
            {
                payment_id,
                status: 'succeeded'
            }
        );


        return res.status(200).json({
            message: 'Success'
        });
    }
    catch (err) {
        console.log('Error', err)
        return res.status(400).json({
            error: err.code,
            message: err.message,
        });
    }
}

const PaymentSuccessCallback = async (req, res, next) => {

    try {
        return res.status(200).json({
            message: 'Success'
        });
    }
    catch (err) {
        console.log('Error', err)
        return res.status(400).json({
            error: err.code,
            message: err.message,
        });
    }
};


const PaymentFailedCallback = async (req, res, next) => {

    try {
        return res.status(200).json({
            message: 'Failed'
        });
    }
    catch (err) {
        console.log('Error', err)
        return res.status(400).json({
            error: err.code,
            message: err.message,
        });
    }
};


const CreatePaymentIntent = async (req, res, next) => {

    try {

        const {
            amount,
            description,
            event_id,
            currency = 'PHP',
            capture_type = 'automatic',
        } = req.body;

        const paymentIntentResponse = await createPaymentIntent({
            amount,
            description,
            currency,
            capture_type
        });


        await EventPayments.CREATE({
            event_id,
            amount,
            payment_type: 'payment_intent',
            ref_id: paymentIntentResponse && paymentIntentResponse.data && paymentIntentResponse.data.id,
            status: paymentIntentResponse && paymentIntentResponse.data && paymentIntentResponse.data.attributes && paymentIntentResponse.data.attributes.status,
        })

        return res.status(200).json({
            message: 'Success',
            data: {
                payment_intent_id: paymentIntentResponse.data && paymentIntentResponse.data.id,
                client_key: paymentIntentResponse.data && paymentIntentResponse.data.attributes && paymentIntentResponse.data.attributes.client_key,
                amount: paymentIntentResponse.data && paymentIntentResponse.data.attributes && paymentIntentResponse.data.attributes.amount,
                created_at: paymentIntentResponse.data && paymentIntentResponse.data.attributes && paymentIntentResponse.data.attributes.created_at,
                status: paymentIntentResponse.data && paymentIntentResponse.data.attributes && paymentIntentResponse.data.attributes.status
            }
        });
    }
    catch (err) {
        console.log('Error', err.response.data)
        return res.status(400).json({
            error: err.code,
            message: err.response.data
        });
    }
};

const GetPaymentIntentById = async (req, res, next) => {

    try {
        const {
            id
        } = req.params;

            console.log('idddddddd', id)
        const paymentIntentResponse = await rerievePaymentIntentById(id);

        return res.status(200).json({
            data: paymentIntentResponse
        });
    }
    catch (err) {
        console.log('errrrr', err)
        // console.log('Error ', err.response.data)
        return res.status(400).json({
            error: err.code,
            message: err.response.data
        });
    }
}


const AttachPaymentIntent = async (req, res, next) => {

    try {

        const {
            payment_intent_id
        } = req.params;
        const {
            event_id,
            payment_method_id,
            selected_talent,
            return_url
        } = req.body;


        const paymentIntentResponse = await confirmPaymentIntent({
            payment_intent_id,
            payment_method_id,
            event_id,
            return_url
        });

        const paymentId = paymentIntentResponse && paymentIntentResponse.data &&
            paymentIntentResponse.data.attributes &&
            paymentIntentResponse.data.attributes.payments &&
            paymentIntentResponse.data.attributes.payments[0] &&
            paymentIntentResponse.data.attributes.payments[0].id;

        await EventPayments.UPSERT(
            {
                event_id,
                ref_id: payment_intent_id
            },
            {
                event_id,
                status: paymentIntentResponse &&
                    paymentIntentResponse.data &&
                    paymentIntentResponse.data.attributes &&
                    paymentIntentResponse.data.attributes.status,

                payment_id: paymentId
            }
        );

        /*
        event_id,
                ref_id: payment_intent_id
            },
            */

        const currentEventPayment = await EventPayments.GET(
            {
                where: {
                    event_id,
                    ref_id: payment_intent_id
                }
            }
        );


        if (currentEventPayment && currentEventPayment.dataValues) {

            for (let talent of selected_talent) {
                await EventPaymentDetails.CREATE({
                    event_id,
                    event_payment_id: currentEventPayment.dataValues.event_payment_id,
                    talent_id: talent.talent_id,
                    amount: talent.service_rate,
                    status: 1
                })
            }

        }



        return res.status(200).json({
            message: 'Success',
            data: paymentIntentResponse && paymentIntentResponse.data
        });
    }
    catch (err) {
        console.log('Error ', err.response.data)
        return res.status(400).json({
            error: err.code,
            message: err.message,
        });
    }
};



const CreateRefund = async (req, res, next) => {

    try {
        const {
            amount,
            payment_id,
            notes,
            reason,
            event_id
        } = req.body;


        const refundResponse = await createRefund({
            amount,
            payment_id,
            notes,
            reason
        });

        if (refundResponse && refundResponse.data) {
            EventRefund.CREATE({
                event_id,
                refund_id: refundResponse.data.id,
                amount: amount / 100,
                reason: notes
            });
        }


        return res.status(200).json({
            message: 'Refund has been made successfully!',
            data: refundResponse
        });
    }
    catch (err) {
        // console.log('Error ', err.response.data)
        return res.status(400).json({
            error: err.code,
            message: err.response.data
        });
    }
};


const GetRefundById = async (req, res, next) => {

    try {
        const {
            id
        } = req.params;

        const refundResponse = await retrieveRefundById(id);

        return res.status(200).json({
            refund: refundResponse
        });
    }
    catch (err) {
        // console.log('Error ', err.response.data)
        return res.status(400).json({
            error: err.code,
            message: err.response.data
        });
    }
}



const GetRefunds = async (req, res, next) => {

    try {

        const refundResponse = await listRefunds();

        return res.status(200).json({
            data: refundResponse
        });
    }
    catch (err) {
        // console.log('Error ', err.response.data)
        return res.status(400).json({
            error: err.code,
            message: err.response.data
        });
    }
}



export {
    GetPayments,
    GetPaymentIntentById,
    CreateSourcePayment,
    ConfirmSourcePayment,
    GetPaymentById,
    GetSourceById,
    PaymentSuccessCallback,
    PaymentFailedCallback,
    CreatePaymentIntent,
    AttachPaymentIntent,
    CreateRefund,
    GetRefundById,
    GetRefunds,
    UpdatePaymentIntentStatus
};