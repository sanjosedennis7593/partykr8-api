import axios from 'axios';

import { API_URL } from '../config/api';
import {
    PAYMONGO_PUBLIC_KEY,
    PAYMONGO_SECRET_KEY
} from '../config/paymongo';
import {
    PAYPAL_API_ROOT_URL,
    PAYPAL_CLIENT_KEY,
    PAYPAL_SECRET_KEY
} from '../config/paypal';

const PAYMONGO_ROOT_URL = 'https://api.paymongo.com';
const PAYMONGO_API = `${PAYMONGO_ROOT_URL}/v1`


const PAYPAL_API_ROOT_URL_V1 = `${PAYPAL_API_ROOT_URL}/v1`;
const PAYPAL_API_ROOT_URL_V2 = `${PAYPAL_API_ROOT_URL}/v2`;

let ENCODED_SECRET_KEY = new Buffer.from(PAYMONGO_SECRET_KEY)
ENCODED_SECRET_KEY = ENCODED_SECRET_KEY.toString('base64');

let ENCODED_PUBLIC_KEY = new Buffer.from(PAYMONGO_PUBLIC_KEY)
ENCODED_PUBLIC_KEY = ENCODED_PUBLIC_KEY.toString('base64');


let ENCODED_PAYPAL_KEY = new Buffer.from(`${PAYPAL_CLIENT_KEY}:${PAYPAL_SECRET_KEY}`);
ENCODED_PAYPAL_KEY = ENCODED_PAYPAL_KEY.toString('base64');



console.log('ENCODED_PAYPAL_KEY',ENCODED_PAYPAL_KEY)


const getPaypalApiCredentials = () => {
    return {

        // username: PAYPAL_CLIENT_KEY,
        // password: PAYPAL_SECRET_KEY
        Accept: 'application/json',
        Authorization: `Basic ${ENCODED_PAYPAL_KEY}`
    }
}


const setPaymongoHeader = key => {
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
        headers: setPaymongoHeader(ENCODED_SECRET_KEY),
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
        headers: setPaymongoHeader(ENCODED_SECRET_KEY),
    };

    return await axios
        .request(options)
        .then(response => response && response.data);
}

const confirmPaymentIntent = async ({
    payment_intent_id,
    payment_method_id,
    event_id,
    return_url = ''
}) => {

    let returnUrl = return_url ? {
        return_url
    } : {};
    const options = {
        method: 'POST',
        url: `${PAYMONGO_API}/payment_intents/${payment_intent_id}/attach`,
        headers: setPaymongoHeader(ENCODED_SECRET_KEY),
        data: {
            data: {
                attributes: {
                    payment_method: payment_method_id,
                    success: `${API_URL}/callback/payment/success?id=${event_id}`,
                    ...returnUrl
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
        headers: setPaymongoHeader(ENCODED_SECRET_KEY),
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
        headers: setPaymongoHeader(ENCODED_SECRET_KEY)
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
        headers: setPaymongoHeader(ENCODED_SECRET_KEY),
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
        headers: setPaymongoHeader(ENCODED_SECRET_KEY),
    };

    return await axios
        .request(options)
        .then(response => response && response.data)
}

const retrievePaymentById = async id => {
    const options = {
        method: 'GET',
        url: `${PAYMONGO_API}/payments/${id}`,
        headers: setPaymongoHeader(ENCODED_PUBLIC_KEY)
    };

    return await axios
        .request(options)
        .then(response => response && response.data)
};


const createRefund = async ({
    amount,
    payment_id,
    notes,
    reason
}) => {
    const options = {
        method: 'POST',
        url: `${PAYMONGO_ROOT_URL}/refunds`,
        headers: setPaymongoHeader(ENCODED_SECRET_KEY),
        data: {
            data: {
                attributes: {
                    amount: amount,
                    payment_id,
                    notes,
                    reason
                }
            }
        }
    }

    return await axios
        .request(options)
        .then(response => response && response.data)
};

const retrieveRefundById = async id => {
    const options = {
        method: 'GET',
        url: `${PAYMONGO_ROOT_URL}/refunds/${id}`,
        headers: setPaymongoHeader(ENCODED_SECRET_KEY)
    };

    return await axios
        .request(options)
        .then(response => response && response.data)
};

const listRefunds = async () => {
    const options = {
        method: 'GET',
        url: `${PAYMONGO_ROOT_URL}/refunds`,
        headers: setPaymongoHeader(ENCODED_SECRET_KEY)
    };

    return await axios
        .request(options)
        .then(response => response && response.data)

}


/* END OF PAYMONGO API */

/* PAYPAL API */

const paypalCreateToken = async () => {
    const apiCredentials = getPaypalApiCredentials();

    const options = {
        method: 'POST',
        url: `${PAYPAL_API_ROOT_URL_V1}/oauth2/token?grant_type=client_credentials`,
        //auth: apiCredentials
        headers: {
            ...apiCredentials,
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    };

    return await axios
        .request(options)
        .then(response => response.data);

}

const paypalCreateOrder = async data => {
    const apiCredentials = getPaypalApiCredentials();
 
    const options = {
        method: 'POST',
        url: `${PAYPAL_API_ROOT_URL_V2}/checkout/orders`,
        data: {
            ...data
        },
        headers: {
            ...apiCredentials,
            'Content-Type': 'application/json',
        }
    };

    const response =  await axios
        .request(options)
        .then(response => response && response.data);

    return response;

}

const paypalCaptureOrder = async orderId => {
    const apiCredentials = getPaypalApiCredentials();

    const options = {
        method: 'POST',
        url: `${PAYPAL_API_ROOT_URL_V2}/checkout/orders/${orderId}/capture`,

        headers: {
            ...apiCredentials,
            'Content-Type': 'application/json',
        }
    };

    const response =  await axios
        .request(options)
        .then(response => response && response.data);

    return response;

}

const paypalGetOrderDetails = async orderId => {
    const apiCredentials = getPaypalApiCredentials();

    const options = {
        method: 'GET',
        url: `${PAYPAL_API_ROOT_URL_V2}/checkout/orders/${orderId}`,

        headers: {
            ...apiCredentials,
            'Content-Type': 'application/json',
        }
    };

    const response =  await axios
        .request(options)
        .then(response => response && response.data);

    return response;

}


const paypalRefundOrder = async (captureId, data) => {
    const apiCredentials = getPaypalApiCredentials();

    const options = {
        method: 'POST',
        url: `${PAYPAL_API_ROOT_URL_V2}/payments/captures/${captureId}/refund`,
        data,
        headers: {
            ...apiCredentials,
            'Content-Type': 'application/json',
        }
    };

    const response =  await axios
        .request(options)
        .then(response => response && response.data);

    return response;

}
const paypalGetRefundDetails = async refundId => {
    const apiCredentials = getPaypalApiCredentials();
 
    const options = {
        method: 'GET',
        url: `${PAYPAL_API_ROOT_URL_V2}/payments/refunds/${refundId}`,

        headers: {
            ...apiCredentials,
            'Content-Type': 'application/json',
        }
    };

    const response =  await axios
        .request(options)
        .then(response => response && response.data);
    return response;

}


/* END OF PAYPAL API */


export {
    createPaymentIntent,
    createPaymentSource,
    retrievePaymentSource,
    createPayment,
    listPayments,
    retrievePaymentById,
    confirmPaymentIntent,
    rerievePaymentIntentById,
    createRefund,
    retrieveRefundById,
    listRefunds,

    paypalCreateToken,
    paypalCreateOrder,
    paypalCaptureOrder,
    paypalGetOrderDetails,
    paypalRefundOrder,
    paypalGetRefundDetails
}
