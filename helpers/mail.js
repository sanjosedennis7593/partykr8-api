import { mailClient, paymentMailClient, SMTP_USER, PAYMENT_SMTP_USER } from "../config/mail";

const sendMessage = (mailOptions, type = 'default') => {
    return new Promise((resolve, reject) => {
        if(type === 'payment') {
            paymentMailClient.sendMail({ ...mailOptions, from: PAYMENT_SMTP_USER }, (err, info) => {
                console.log(err, info)
                if (err) {
                    reject(err)
                } else {
                    resolve(info)
                }
            });
        }
        else {
            mailClient.sendMail({ ...mailOptions, from: SMTP_USER }, (err, info) => {
                console.log(err, info)
                if (err) {
                    reject(err)
                } else {
                    resolve(info)
                }
            })
        }
    })
};


export {
    sendMessage
}