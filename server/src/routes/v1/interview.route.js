const express = require("express");
const { interviewControllers } = require("../../controllers");
const { multerMiddleware } = require("../../middlewares");

const router = express.Router();


/**
 * @route POST /api/v1/interview/
 * @description generate new interview report on the basis of user self description.
 * @access private
 */

router.post("/", multerMiddleware.single("resume") , interviewControllers.generateInterviewReportController);


/**
 * @route GET/api/interview/:interviewId,
 * @description get interview report by interviewId,
 * @access private
 */

router.get("/:interviewId", interviewControllers.getInterviewReportByIdController);

/**
 * @route GET/api/v1/interview/,
 * @description get interview report by interviewId,
 * @access private
 */

router.get("/", interviewControllers.getAllInterviewReportsController);

/**
 * @route GET/api/v1/interview/resume-pdf/:interviewId,
 * @description generate a resume pdf file on the basis of user resume, job description and self description,
 * @access private
 */
router.get("/resume-pdf/:interviewId", interviewControllers.generateResumePdfController);


/**
 * @route DELETE/api/v1/interview/:interviewId,
 * @description delete interview report by interviewId,
 * @access private
 */

router.delete("/:interviewId", interviewControllers.deleteInterviewReportController)


module.exports = router;