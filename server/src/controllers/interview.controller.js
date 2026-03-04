const pdfParse = require("pdf-parse");
const { generateData } = require("../services");
const { InterviewReportModel } = require("../models");
const { StatusCodes } = require("http-status-codes");
const { errorHandlerMiddleware } = require("../middlewares");

/**
 * @name generateInterviewReportController
 * @description takes resume, self description and job description from user and genearate a interview report using Google GEMINI AI
 * @access private 
 */

const generateInterviewReportController = async (req, res, next) => {
  try {
    const user = req.userId;
    const resumeFile = req.file;
    const { selfDescription, jobDescription } = req.body;

    if (!resumeFile || !selfDescription || !jobDescription) return next(errorHandlerMiddleware.errorHandler(StatusCodes.BAD_REQUEST, "all fields are required"));

    if (resumeFile.size > 3 * 1024 * 1024) return next(errorHandlerMiddleware.errorHandler(StatusCodes.BAD_REQUEST, "Resume file too large (max 3MB allowed)"));


 
    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(resumeFile.buffer))).getText(); 

    if (!resumeContent) return next(StatusCodes.BAD_REQUEST, "Could not extract text from resume");

    const interviewReportByAi = await generateData.generateInterviewReport({
      resume: resumeContent,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await InterviewReportModel.create({
      user,
      resume: resumeContent.text,
      selfDescription,
      jobDescription,
      ...interviewReportByAi,
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Interview report generated successfully",
      data: interviewReport,
    });

  } catch (error) {
    console.error("Interview Controller Error:", error);
    next(error);
  }
};

/**
 * @name getInterviewReportByIdController
 * @description take report id from client and send that intervie report data to the user
 * @access private
 */

const getInterviewReportByIdController = async(req, res, next)=>{
    try {
        
        const {interviewId} = req.params;

        const interviewReport = await InterviewReportModel.findOne({_id:interviewId}).select("-resume -selfDescription -jobDescription"); 

        if(!interviewReport) return next(errorHandlerMiddleware.errorHandler(StatusCodes.NOT_FOUND, "Interview report not found"));

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Interview report fetched successfully.",
            data: interviewReport,
        })

    } catch (error) {
        console.log("get report: ", error);
        return next(error);

    }
}


/**
 * @name getAllInterviewReportsController
 * @description send all interview report files to the login user
 * @access private
 */

const getAllInterviewReportsController = async (req, res, next) => {
    try {
        
        const userId = req.userId;

        const allInterviewReports = await InterviewReportModel.find({user: userId}).sort({createdAt: -1}).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "All reports fetched successfully",
            data: allInterviewReports

        })

    } catch (error) {
        console.log("get all report: ", error);
        return next(error);
    }
}


/**
 * @name generateResumePdfController
 * @description generate a resume pdf file on the basis of user resume, job description and self description,
 * @access private
 */

const generateResumePdfController = async (req, res, next) => {
  try {
    const { interviewId } = req.params; 
    
    const interviewReport = await InterviewReportModel.findOne({ _id: interviewId, user: req.userId });

    if (!interviewReport) return next(errorHandlerMiddleware.errorHandler(StatusCodes.NOT_FOUND, "Interview report not found"));  

    const pdfBuffer = await generateData.generateResumePDF(interviewReport);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=resume_${interviewId}.pdf`,
    });
    return res.send(pdfBuffer);  
  } catch (error) {
    console.error("Generate Resume PDF Error:", error);
    return next(error);
  }
};

/**
 * @name deleteInterviewReportController
 * @description delete interview report by interviewId,
 * @access private
 */

const deleteInterviewReportController = async (req, res, next) => {
  try {
    const { interviewId } = req.params;
    const deletedReport = await InterviewReportModel.findOneAndDelete({ _id: interviewId, user: req.userId });

    if (!deletedReport) {
      return next(errorHandlerMiddleware.errorHandler(StatusCodes.NOT_FOUND, "Interview report not found or you don't have permission to delete it"));
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Interview report deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
}


module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
  deleteInterviewReportController,
};