const { StatusCodes } = require("http-status-codes");
const { errorHandlerMiddleware } = require("../middlewares");
const { UserModel, BlacklistModel, InterviewReportModel } = require("../models");
const { JWT } = require("../utils");
const { imageKitService } = require("../services");

/**
 * @name registerController
 * @description register a new user, accepts username, email, password
 * @access public
 */

const registerController = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
        return next(
        errorHandlerMiddleware.errorHandler(
            StatusCodes.BAD_REQUEST,
            "all fields are required"
        ),
        );

    const isUserAlreadyExists = await UserModel.findOne({
        $or: [{ email }, { username }],
    });

    if (isUserAlreadyExists)
        return next(errorHandlerMiddleware.errorHandler(StatusCodes.CONFLICT, "account already exists with this email or username"));

    const newUser = await UserModel.create({
        username,
        email,
        password,
    });

    const token = JWT.generateToken(newUser._id);

    res.cookie("token",token);
    return res.status(StatusCodes.CREATED).json({
        success: true,
        message: "user registered successfully",
        data: newUser,
    });

  } catch (error) {
    console.log("registration error: ", error);
    return next(error);
  }
};

/**
 * @name loginController
 * @description login a registered user, accepts username or email and password
 * @access public
 */

const loginController = async (req, res, next) => {
  try {
    const { user, password } = req.body;

    if(!user || !password) return next(errorHandlerMiddleware.errorHandler(StatusCodes.BAD_REQUEST,"all fields are required"));

    const userExists = await UserModel.findOne({
      $or:[{email: user}, {username: user}],
    });

    if(!userExists) return next(errorHandlerMiddleware.errorHandler(StatusCodes.NOT_FOUND, "wrong email / username or password"));

    const isPasswordCorrect = await userExists.comparePassword(password);

    if(!isPasswordCorrect) return next(errorHandlerMiddleware.errorHandler(StatusCodes.NOT_FOUND, "wrong email / username or password"));

    const token = JWT.generateToken(userExists._id);

    res.cookie("token", token);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "user login successfully",
      data: userExists
    })

  } catch (error) {
    console.log("login error: ", error);
    return next(error);
  }
};


/**
 * @name logoutController
 * @description clear token from user cookie and add token to the blacklist
 * @access public
 */

const logoutController = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if(!token) return next(errorHandlerMiddleware.errorHandler(StatusCodes.UNAUTHORIZED, "unauthorized to logout"));
    await BlacklistModel.create({token});
    res.clearCookie("token");
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "user logout successfully",
    });
  } catch (error) {
    console.log("logout error: ", error);
    return next(error);
  }
};

/**
 * @name checkAuth
 * @description using userId get the user from database and send to the client
 * @access private
 */

const checkAuth = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findOne({_id:userId});
  

    if(!user) return next(errorHandlerMiddleware.errorHandler(StatusCodes.NOT_FOUND,"user not exists"));

    return res.status(StatusCodes.OK).json({
      success:true,
      message:"",
      data: user,
    });

  } catch (error) {
    console.log("checkAuth error: ",error);
    return next(error);
  }
}


/**
 * @name deleteUserController
 * @description delete user account and all reports permanently from database, also clear token from user cookie and add the token in blacklist
 * @access private
 */

const deleteUserController = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { password } = req.body;

    if (!password)
      return next(
        errorHandlerMiddleware.errorHandler(
          StatusCodes.BAD_REQUEST,
          "Password is required to delete account"
        )
      );

    const user = await UserModel.findById(userId);
    if (!user)
      return next(
        errorHandlerMiddleware.errorHandler(
          StatusCodes.NOT_FOUND,
          "User not exists"
        )
      );

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect)
      return next(
        errorHandlerMiddleware.errorHandler(
          StatusCodes.UNAUTHORIZED,
          "Wrong Password"
        )
      );

    if (user.profilePictureId) {
      await imageKitService.deleteFile(user.profilePictureId);
    }

    await InterviewReportModel.deleteMany({ user: userId });
    await UserModel.findByIdAndDelete(userId);

    const token = req.cookies?.token;
    if (token) {
      await BlacklistModel.create({ token });
    }

    res.clearCookie("token");

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "User account deleted successfully",
    });

  } catch (error) {
    console.log("delete account error: ", error);
    return next(error);
  }
};

module.exports = {
  registerController,
  loginController,
  logoutController,
  checkAuth,
  deleteUserController,
};
