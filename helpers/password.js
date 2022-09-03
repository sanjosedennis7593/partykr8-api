import crypto from "crypto"
import bcrypt from "bcryptjs";

const saltRounds = 10;

const comparePassword = (password,confirmPassword) => {
    return bcrypt.compareSync(password, confirmPassword);
}

const encryptPassword = password => {
    return bcrypt.hashSync(password, saltRounds);
}

const generateCode = (size) => {
    return crypto.randomBytes(size).toString('hex');
}

export {
    comparePassword,
    encryptPassword,
    generateCode
}