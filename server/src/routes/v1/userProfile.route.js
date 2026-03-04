const express = require("express");
const { userProfileControllers } = require("../../controllers");
const { multerMiddleware } = require("../../middlewares");

const router = express.Router();

/**
 * @name PUT /api/v1/profile/update
 * @description update user profile, accepts username, fullname and profile picture
 * @access private
 */

router.put("/update", multerMiddleware.single("profilePicture"), userProfileControllers.updateUserProfileController);


module.exports = router;