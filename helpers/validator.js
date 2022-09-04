import { body } from 'express-validator';

const SignupValidator = [
    body('email').isEmail().withMessage('Invalid email format').trim().escape(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 chars long').trim().escape(),
    body('firstname').not().isEmpty().trim().escape(),
    body('lastname').not().isEmpty().trim().escape(),
    body('address').not().isEmpty().trim().escape(),
    body('city').not().isEmpty().trim().escape(),
    body('state').not().isEmpty().trim().escape(),
    body('phone_number').not().isEmpty().trim().escape()
];

const UpdateUserDetailsValidator = [
    body('email').isEmail().withMessage('Invalid email format').trim().escape(),
    body('firstname').not().isEmpty().trim().escape(),
    body('lastname').not().isEmpty().trim().escape(),
    body('address').not().isEmpty().trim().escape(),
    body('city').not().isEmpty().trim().escape(),
    body('state').not().isEmpty().trim().escape(),
    body('phone_number').not().isEmpty().trim().escape()
];


const TalentSignupValidator = [
    body('address').not().isEmpty().trim().escape(),
    body('phone_number').not().isEmpty().trim().escape(),
    body('type').not().isEmpty().trim().escape(),
    body('genre').not().isEmpty().trim().escape(),
    body('service_rate').not().isEmpty().isNumeric().withMessage('Service rate must be a decimal value'),
    body('facebook_url').not().isEmpty().isURL().withMessage('Facebook URL must be in URL format'),
    body('twitter_url').not().isEmpty().isURL().withMessage('Twitter URL must be in URL format'),
    body('tiktok_url').not().isEmpty().isURL().withMessage('TikTok URL must be in URL format'),
];


export {
    SignupValidator,
    UpdateUserDetailsValidator,
    TalentSignupValidator
}

