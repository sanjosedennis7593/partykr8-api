const GetCurrentUser = async (req, res, next) => {
    try {
        let user = {
            ...req.user,
        };
        
        delete user.password;
        return res.status(200).json({
            ...user
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
    GetCurrentUser
};