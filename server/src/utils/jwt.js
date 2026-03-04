const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../config/server.config");

const generateToken = (userId) => {
    return jwt.sign({id:userId}, JWT_SECRET_KEY, {expiresIn: "30d"});
}

const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET_KEY);
}

module.exports = {
    generateToken,
    verifyToken,
}