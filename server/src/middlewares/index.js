module.exports = {
    errorHandlerMiddleware: require("./errorHandler.middleware"),
    checkAuthMiddleware: require("./auth.middleware"),
    multerMiddleware: require("./file.middleware")
}