const express = require("express");
const authRouter = require("./auth.route");
const interviewRouter = require("./interview.route");
const userProfileRouter = require("./userProfile.route")
const { checkAuthMiddleware } = require("../../middlewares");

const router = express.Router();

// auth route
router.use("/auth", authRouter);

// interview route
router.use("/interview", checkAuthMiddleware, interviewRouter);

// user profile route
router.use("/profile", checkAuthMiddleware, userProfileRouter);

module.exports = router;