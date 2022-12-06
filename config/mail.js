import nodemailer from 'nodemailer';

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

const PAYMENT_SMTP_USER = process.env.PAYMENT_SMTP_USER;
const PAYMENT_SMTP_PASS = process.env.PAYMENT_SMTP_PASS;


let mailClient = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});


let paymentMailClient = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: PAYMENT_SMTP_USER,
        pass: PAYMENT_SMTP_PASS,
    },
});


export {
    mailClient,
    paymentMailClient,
    SMTP_USER,
    PAYMENT_SMTP_USER
}