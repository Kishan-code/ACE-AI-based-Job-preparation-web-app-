const { StatusCodes } = require("http-status-codes");
const { errorHandlerMiddleware } = require("../middlewares");
const { imageKitService } = require("../services");
const UserModel = require("../models/user.model");

const updateUserProfileController = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { username, fullname } = req.body;
    const profilePicture = req.file;
    if (username === undefined && fullname === undefined && !profilePicture) {
      return next(
        errorHandlerMiddleware.errorHandler(
          StatusCodes.BAD_REQUEST,
          "At least one field (username, fullname, profile picture) must be provided for update",
        ),
      );
    }

    if (username) {
      const existingUser = await UserModel.findOne({ username });

      if (existingUser && !existingUser._id.equals(userId)) {
        return next(
          errorHandlerMiddleware.errorHandler(
            StatusCodes.CONFLICT,
            "Username already taken",
          ),
        );
      }
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return next(
        errorHandlerMiddleware.errorHandler(
          StatusCodes.NOT_FOUND,
          "User not found",
        ),
      );
    }

    const updateData = {};

    if (username) updateData.username = username;
    if (fullname !== undefined) updateData.fullname = fullname;

    if (profilePicture) {
        if(user.profilePictureId){
            await imageKitService.deleteFile(user.profilePictureId);
        }
      const { url: profileURL, fileId } =
        await imageKitService.uploadFile(profilePicture);
      if (profileURL) {
        updateData.profilePicture = profileURL;
        updateData.profilePictureId = fileId;
      }
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      returnDocument: "after",
    });

    return res.status(StatusCodes.OK).json({
      message: "Profile updated successfully",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  updateUserProfileController,
};
