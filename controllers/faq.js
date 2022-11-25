import db from '../models';

import Table from '../helpers/database';

const Faq = new Table(db.faq);

const GetAllFaq = () => {
    let response = [];
    try {
        response = Faq.GET_ALL({
            limit: 20,
            order: [['createdAt', 'desc']],
            include: [
                {
                    model: db.users,
                    attributes: [
                        'email',
                        'lastname',
                        'firstname',
                        'avatar_url'
                    ]
                },
            ]
        });
    }
    catch (err) {
        response = [];
    }
    finally {
        return response;
    }
}


const GetFaq = async (req, res, next) => {
    try {

        const response = await GetAllFaq();
        return res.status(200).json({
            list: response
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

const CreateFaq = async (req, res, next) => {
    try {

        const payload = {
            title: req.body.title,
            description: req.body.description,
            user_id: req.user.id
        };
        await Faq.CREATE(payload);
        const response = await GetAllFaq();

        return res.status(200).json({
            list: response
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


const UpdateFaq = async (req, res, next) => {
    try {
        const currentFaq = await Faq.GET({
            where: {
                faq_id: req.params.id
            }
        });
        
        if (!currentFaq) {
            return res.status(400).json({
                message: 'Faq not found!'
            });
        }

        await Faq.UPDATE({
            user_id: req.user.id,
            faq_id: req.params.id
        }, {
            title: req.body.title,
            description: req.body.description,
        });
        const response = await GetAllFaq();
        return res.status(200).json({
            list: response
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


const DeleteFaq = async (req, res, next) => {
    try {
        const currentFaq = await Faq.GET({
            where: {
                faq_id: req.params.id
            }
        });
        
        if (!currentFaq) {
            return res.status(400).json({
                message: 'Faq not found!'
            });
        }

        await Faq.DELETE(
            {
                faq_id: req.params.id
            }
        );
        const response = await GetAllFaq();
        return res.status(200).json({
            list: response
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






export {
    GetFaq,
    CreateFaq,
    UpdateFaq,
    DeleteFaq
}