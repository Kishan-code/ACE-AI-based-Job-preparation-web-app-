const { StatusCodes } = require("http-status-codes");
const { JWT } = require("../utils");
const { BlacklistModel } = require("../models");
const { errorHandler } = require("./errorHandler.middleware");

const checkAuthMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if(!token) return next(errorHandler(StatusCodes.UNAUTHORIZED, "unauthorized access"));

        const isTokenBlacklist = await BlacklistModel.findOne({token});

        if(isTokenBlacklist) return next(errorHandler(StatusCodes.UNAUTHORIZED, "invalid token"));

        const decoded = JWT.verifyToken(token);

        req.userId = decoded.id;

        next();


    } catch (error) {
        console.log("checkAuth error: ",error);
        return next(errorHandler(StatusCodes.UNAUTHORIZED, "JWT error"));
    }
}

module.exports = checkAuthMiddleware;