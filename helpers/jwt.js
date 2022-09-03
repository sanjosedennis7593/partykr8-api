import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt";

const generateAccessToken = (id, email, role) => {
    return jwt.sign({ id, email, role }, JWT_SECRET, {
        expiresIn: 86400 // 24 hours
    });
}

const verifyJwt = (token,callBack) => {
    jwt.verify(token, JWT_SECRET, callBack);
};

export {
    JWT_SECRET,
    generateAccessToken,
    verifyJwt
}