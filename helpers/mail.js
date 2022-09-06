import { mailClient, SMTP_USER } from "../config/mail";

const sendMessage = (mailOptions) => {
    return new Promise((resolve, reject) => {
        mailClient.sendMail({ ...mailOptions, from: SMTP_USER }, (err, info) => {
            console.log(err, info)
            if (err) {
                reject(err)
            } else {
                resolve(info)
            }
        })
    })
};


export {
    sendMessage
}