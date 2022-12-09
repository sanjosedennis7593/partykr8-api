import { API_URL } from '../config/api';

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
    retrieveRefundById,
    createPaymentLinks,
    retrievePaymentLinks,

    paypalCreateToken,
    paypalCreateOrder,
    paypalCaptureOrder,
    paypalGetOrderDetails,
    paypalRefundOrder,
    paypalGetRefundDetails,

} from '../services/payment';

import Table from '../helpers/database';
import { sendMessage } from '../helpers/mail';
import { PAYMENT_MESSAGE } from '../helpers/mail_templates';

import db from '../models';


// const Events = new Table(db.events);
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
            // type,
            amount,
            // description,
            payment_id,
            event_id,
            // payment_intent_id,
            selected_talent = [],
            event
        } = req.body;
        const { user } = req;

        // const eventPaymentResponse = await createPayment({
        //     id,
        //     type,
        //     amount,
        //     description
        // });


        await EventPayments.UPSERT(
            {
                event_id
            },
            {
                payment_type: 'paymongo',
                amount,
                event_id,
                payment_id,
                ref_id: id,
                status: 1 // eventPaymentResponse && eventPaymentResponse.data && eventPaymentResponse.data.attributes && eventPaymentResponse.data.attributes.status
            }
        );


        const currentEventPayment = await EventPayments.GET(
            {
                where: {
                    event_id,
                    payment_id
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

            const totalAmount = selected_talent.reduce((accum, talent) => accum + talent.amount_paid, 0)


            await sendMessage({
                to: user.email,
                subject: `PartyKr8: Talent Payment`,
                html: PAYMENT_MESSAGE({
                    talents: selected_talent,
                    event,
                    id: payment_id,
                    type: 'paymongo',
                    totalAmount,
                    user
                })
            },'payment');

        }



        return res.status(201).json({
            message: 'Payment has been confirm successfully!',
            data: currentEventPayment,
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
        const { payment_intent_id, event_id, payment_id, selected_talent } = req.body;

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
        const currentEventPayment = await EventPayments.GET(
            {
                where: {
                    event_id,
                    ref_id: payment_intent_id
                }
            }
        );

        if (selected_talent) {

            for (let talent of selected_talent) {

                await EventPaymentDetails.UPDATE({
                    talent_id: talent.talent_id,
                    event_payment_id: currentEventPayment.event_payment_id
                }, {
                    status: 1
                });
            }
        }



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

const PaymentCancelCallback = async (req, res, next) => {

    try {
        return res.status(200).json({
            message: 'Cancelled'
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

        const paymentIntentResponse = await rerievePaymentIntentById(id);

        return res.status(200).json({
            data: paymentIntentResponse
        });
    }
    catch (err) {
        console.log('Error', err)
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
            event = {},
            payment_method_id,
            selected_talent,
            return_url,
            payment_type
        } = req.body;
        const { user } = req;


        console.log('event', event)
        const paymentIntentResponse = await confirmPaymentIntent({
            payment_intent_id,
            payment_method_id,
            event_id: event.id,
            return_url
        });

        const paymentId = paymentIntentResponse && paymentIntentResponse.data &&
            paymentIntentResponse.data.attributes &&
            paymentIntentResponse.data.attributes.payments &&
            paymentIntentResponse.data.attributes.payments[0] &&
            paymentIntentResponse.data.attributes.payments[0].id;

        await EventPayments.UPSERT(
            {
                event_id: event.id,
                ref_id: payment_intent_id
            },
            {
                event_id: event.id,
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
                    event_id: event.id,
                    ref_id: payment_intent_id
                }
            }
        );



        if (currentEventPayment && currentEventPayment.dataValues) {

            for (let talent of selected_talent) {
                await EventPaymentDetails.CREATE({
                    event_id: event.id,
                    event_payment_id: currentEventPayment.dataValues.event_payment_id,
                    talent_id: talent.talent_id,
                    amount: talent.service_rate,
                    status: payment_type === 'card' ? 1 : 0
                })
            }

            const totalAmount = selected_talent.reduce((accum, talent) => accum + talent.service_rate, 0)

            await sendMessage({
                to: user.email,
                subject: `PartyKr8: Talent Payment`,
                html: PAYMENT_MESSAGE({
                    talents: selected_talent,
                    event,
                    id: paymentId,
                    type: payment_type,
                    totalAmount,
                    user
                })
            },'payment');


        }



        return res.status(200).json({
            message: 'Success',
            data: paymentIntentResponse && paymentIntentResponse.data
        });
    }
    catch (err) {
        console.log('Error ', err)
        return res.status(400).json({
            error: err.code,
            message: err.message,
        });
    }
};



const CreatePaymentLinks = async (req, res, next) => {

    try {

        const {
            event_id,
            amount,
            description,
            remarks = '',
           
        } = req.body;

        const paymentLinkResponse = await createPaymentLinks({
            amount,
            description,
            remarks
        });


        
        await EventPayments.UPSERT(
            {
                event_id
            },
            {
                payment_type: 'paymongo',
                amount,
                event_id,
                payment_id: '',
                ref_id: '',
                status: 0 // eventPaymentResponse && eventPaymentResponse.data && eventPaymentResponse.data.attributes && eventPaymentResponse.data.attributes.status
            }
        );


        return res.status(200).json({
            message: 'Success',
            data: {
                ...paymentLinkResponse.data
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


const GetPaymentLinks = async (req, res, next) => {

    try {
        const {
            id
        } = req.params;

        const paymentLinkResponse = await retrievePaymentLinks(id);

        return res.status(200).json({
            paymentLinks: paymentLinkResponse
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



const CreateRefund = async (req, res, next) => {

    try {
        const {
            amount,
            payment_id,
            notes,
            reason,
            event_id,
            event_payment_detail_id = null
        } = req.body;


        const refundResponse = await createRefund({
            amount: amount,
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

        if (event_payment_detail_id) {

            await EventPaymentDetails.UPDATE({
                event_payment_detail_id
            }, {
                status: 0
            });
        }


        return res.status(200).json({
            message: 'Refund has been made successfully!',
            data: refundResponse
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



const CreatePaypalToken = async (req, res, next) => {
    try {
        const response = await paypalCreateToken();
        return res.status(200).json({
            data: response
        });
    }
    catch (err) {
        console.log('Error CreatePaypalToken', err)
        return res.status(400).json({
            error: err.code,
            message: err.response
        });
    }
};


const CreatePaypalOrder = async (req, res, next) => {

    try {
        const { order_items = [], amount } = req.body;

        const items = order_items;

        const amountPayload = {
            currency_code: "PHP",
            value: amount,
            breakdown: {
                item_total: {
                    currency_code: "PHP",
                    value: amount
                }
            }
        };

        const payload = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    items,
                    amount: amountPayload
                }
            ],
            application_context: {
                return_url: `${API_URL}/callback/payment/success?type=paypal`,
                cancel_url: `${API_URL}/callback/payment/cancel`,
            }
        }

        const response = await paypalCreateOrder(payload);

        return res.status(200).json({
            data: response
        });
    }
    catch (err) {
        console.log('Error CreatePaypalOrder', err)
        return res.status(400).json({
            error: err.code,
            message: err.response
        });
    }
};

const CapturePaypalOrder = async (req, res, next) => {

    try {
        const { order_id } = req.params;
        const { event_id, amount, event, selected_talent = [] } = req.body;
        const { user } = req;

        const response = await paypalCaptureOrder(order_id);

        if (response) {
            const status = response && response.status === 'COMPLETED' ? 'paid' : 'failed';

            const captureId = response && response.purchase_units && response.purchase_units[0] && response.purchase_units[0].payments && response.purchase_units[0].payments.captures && response.purchase_units[0].payments.captures[0].id;
            await EventPayments.CREATE({
                event_id,
                amount: amount * 100,
                payment_type: 'paypal',
                ref_id: response && response.id, // ORDER ID
                payment_id: captureId,
                status: status
            })


            const currentEventPayment = await EventPayments.GET(
                {
                    where: {
                        event_id,
                        ref_id: order_id
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

                console.log('selected_talent', selected_talent)
                const totalAmount = selected_talent.reduce((accum, talent) => accum + talent.amount_paid, 0)

                
                await sendMessage({
                    to: user.email,
                    subject: `PartyKr8: Talent Payment`,
                    html: PAYMENT_MESSAGE({
                        talents: selected_talent,
                        event,
                        id: captureId,
                        type: 'paypal',
                        totalAmount,
                        user
                    })
                },'payment');

            }



        }

        return res.status(200).json({
            data: response
        });
    }
    catch (err) {
        console.log('Error CreatePaypalOrder', err)
        return res.status(400).json({
            error: err.code,
            message: err.response
        });
    }
};


const GetPaypalOrderDetails = async (req, res, next) => {

    try {
        const { order_id } = req.params;
        const response = await paypalGetOrderDetails(order_id);

        return res.status(200).json({
            data: response
        });
    }
    catch (err) {
        console.log('Error CreatePaypalOrder', err)
        return res.status(400).json({
            error: err.code,
            message: err.response
        });
    }
};

const RefundPaypalOrder = async (req, res, next) => {

    try {
        const { capture_id } = req.params;
        const { amount, event_id } = req.body;

        const payload = {
            amount: {
                value: amount / 100,
                currency_code: "PHP"
            },
            note_to_payer: "Refund Payment"
        };

        const response = await paypalRefundOrder(capture_id, payload);


        EventRefund.CREATE({
            event_id,
            refund_id: response.id,
            amount: amount / 100,
            reason: "refund"
        });

        return res.status(200).json({
            data: []
        });
    }
    catch (err) {
        console.log('Error CreatePaypalOrder', err)
        return res.status(400).json({
            error: err.code,
            message: err.response
        });
    }
};



const GetPaypalRefundById = async (req, res, next) => {

    try {
        const {
            refund_id
        } = req.params;

        console.log('refund_id', req.params)

        const refundResponse = await paypalGetRefundDetails(refund_id);
        return res.status(200).json({
            refund: refundResponse
        });
    }
    catch (err) {
        // console.log('Error ', err)
        return res.status(400).json({
            error: err.code,
            message: err.response
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
    UpdatePaymentIntentStatus,
    CreatePaymentLinks,
    GetPaymentLinks,


    CreatePaypalToken,
    CreatePaypalOrder,
    CapturePaypalOrder,
    GetPaypalOrderDetails,
    RefundPaypalOrder,
    PaymentCancelCallback,
    GetPaypalRefundById
};