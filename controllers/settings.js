import db from '../models';

import Table from '../helpers/database';

const Features = new Table(db.features);

const GetAllFeatures = () => {
    let response = [];
    try {
        response = Features.GET_ALL({
            order: [['createdAt', 'desc']],

        });
    }
    catch (err) {
        response = [];
    }
    finally {
        return response;
    }
};

const GetFeatures = async (req, res, next) => {
    try {

        const response = await GetAllFeatures();
        return res.status(200).json({
            features: response
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




const UpdateFeatures = async (req, res, next) => {
    try {
        const { data = [] } = req.body;
        for (let item of data) {
            await Features.UPSERT(
                {
                    feature_id: item.feature_id
                },
                {
                    value: item.value
                }
            );
        }
        const response = await GetAllFeatures();
        return res.status(200).json({
            features: response
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
    GetFeatures,
    UpdateFeatures,
}