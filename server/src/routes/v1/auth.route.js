const express = require("express");
const { authControllers } = require("../../controllers");
const { checkAuthMiddleware } = require("../../middlewares");

const router = express.Router();


/**
 * @route POST /api/v1/auth/register
 * @description register a new user
 * @access public
 */

router.post("/register", authControllers.registerController);


/**
 * @route POST /api/v1/auth/login
 * @description login a user with email / username and password  
 * @access public
 */

router.post("/login", authControllers.loginController);


/**
 * @route GET /api/v1/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */

router.get("/logout", authControllers.logoutController);


/**
 * @route GET /api/v1/auth/me
 * @description check token session and authenticate user 
 * @access private
 */

router.get("/me", checkAuthMiddleware, authControllers.checkAuth);


/**
 * @route DELETE /api/v1/auth/delete
 * @description delete user account and all reports permanently from database, also clear token from user cookie and add the token in blacklist
 * @access private
 */

router.delete("/delete", checkAuthMiddleware, authControllers.deleteUserController);

module.exports = router;