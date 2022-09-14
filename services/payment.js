import axios from 'axios';

import { API_URL } from '../config/api';
import {
    PAYMONGO_PUBLIC_KEY,
    PAYMONGO_SECRET_KEY
} from '../config/paymongo';


const PAYMONGO_API = 'https://api.paymongo.com/v1'

let ENCODED_SECRET_KEY = new Buffer.from(PAYMONGO_SECRET_KEY)
ENCODED_SECRET_KEY = ENCODED_SECRET_KEY.toString('base64');

let ENCODED_PUBLIC_KEY = new Buffer.from(PAYMONGO_PUBLIC_KEY)
ENCODED_PUBLIC_KEY = ENCODED_PUBLIC_KEY.toString('base64');



const setHeaders = key => {
    return {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Basic ${key}`
    }
}
/*
    PAYMENT INTENT FLOW

    1. Create Payment Method (Payment method used)
    2. Create Payment Intent (Handle different state of payment until it succeeds)
    3. Attach Payment Intent (Confirmation of payment)

*/

const createPaymentIntent = async ({
    amount,
    description,
    currency = 'PHP',
    capture_type = 'automatic',

}) => {

    const options = {
        method: 'POST',
        url: `${PAYMONGO_API}/payment_intents`,
        headers: setHeaders(ENCODED_SECRET_KEY),
        data: {
            data: {
                attributes: {
                    amount,
                    currency,
                    description,
                    capture_type,
                    payment_method_allowed: ['atome', 'card', 'dob', 'paymaya', 'billease'],
                    payment_method_options: { card: { request_three_d_secure: 'any' } },
                }
            }
        }
    };

    return await axios
        .request(options)
        .then(response => response && response.data)
};

const rerievePaymentIntentById = async id => {
    const options = {
        method: 'GET',
        url: `${PAYMONGO_API}/payment_intents/${id}`,
        headers: setHeaders(ENCODED_PUBLIC_KEY),
    };

    return await axios
        .request(options)
        .then(response => response && response.data);
}

const confirmPaymentIntent = async ({
    payment_intent_id,
    payment_method_id,
    event_id
}) => {

    const options = {
        method: 'POST',
        url: `${PAYMONGO_API}/payment_intents/${payment_intent_id}/attach`,
        headers: setHeaders(ENCODED_SECRET_KEY),
        data: {
            data: {
                attributes: {
                    payment_method: payment_method_id,
                    success: `${API_URL}/callback/payment/success?id=${event_id}`,
                }
            }
        }
    };

    return await axios
        .request(options)
        .then(response => response && response.data)
}


// const cancelPaymentIntent = id => {
//     paymongoAuth(PAYMONGO_SECRET_KEY);
//     return payMongoInstance.cancelAPayment({ id })
// }


/*
    PAYMENT SOURCES PROCESS (FOR GCASH AND GRAB PAYMENTS)

    1. Create source and authorize on checkout url, then status will change to chargable
    2. Pass source id on Create Payment, then status will change to paid

*/

const createPaymentSource = async ({
    event_id,
    amount,
    billing_name,
    billing_phone,
    billing_email,
    type,
    currency = 'PHP'
}) => {

    const options = {
        method: 'POST',
        url: `${PAYMONGO_API}/sources`,
        headers: setHeaders(ENCODED_SECRET_KEY),
        data: {
            data: {
                attributes: {
                    amount,
                    redirect: {
                        success: `${API_URL}/callback/payment/success?id=${event_id}`,
                        failed: `${API_URL}/callback/payment/failed?id=${event_id}`,
                    },
                    billing: {
                        name: billing_name,
                        phone: billing_phone,
                        email: billing_email
                    },
                    type,
                    currency
                }
            }
        }
    };

    return await axios
        .request(options)
        .then(response => response && response.data)

};

const retrievePaymentSource = async id => {
    const options = {
        method: 'GET',
        url: `${PAYMONGO_API}/sources/${id}`,
        headers: setHeaders(ENCODED_SECRET_KEY)
    };

    return await axios
        .request(options)
        .then(response => response && response.data)
};


const createPayment = async ({
    id,
    type,
    amount,
    description = '',
    currency = 'PHP'
}) => {

    const options = {
        method: 'POST',
        url: `${PAYMONGO_API}/payments`,
        headers: setHeaders(ENCODED_SECRET_KEY),
        data: {
            data: {
                attributes: {
                    amount,
                    source: { id, type },
                    currency,
                    description
                }
            }
        }
    };

    return await axios
        .request(options)
        .then(response => response && response.data)

};

const listPayments = async (limit = '10') => {
    const options = {
        method: 'GET',
        url: `${PAYMONGO_API}/payments`,
        headers: setHeaders(ENCODED_SECRET_KEY),
    };

    return await axios
        .request(options)
        .then(response => response && response.data)
}

const retrievePaymentById = async id => {
    const options = {
        method: 'GET',
        url: `${PAYMONGO_API}/payments/${id}`,
        headers: setHeaders(ENCODED_PUBLIC_KEY)
    };

    return await axios
        .request(options)
        .then(response => response && response.data)
};


// const createRefund = (payment_id, reason) => {
//     paymongoAuth(PAYMONGO_SECRET_KEY);
//     // REASON = [duplicate, fraudulent, requested_by_customer, others]
//     return payMongoInstance.createARefund({
//         data: { attributes: { payment_id, reason } }
//     })
// };


export {
    createPaymentIntent,
    createPaymentSource,
    retrievePaymentSource,
    createPayment,
    listPayments,
    retrievePaymentById,
    confirmPaymentIntent,
    rerievePaymentIntentById
}
