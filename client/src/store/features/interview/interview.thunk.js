import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import api from "../../../axios/axios";


export const getInterviewReportByIdThunk = createAsyncThunk("interview/get-report-by-id", 
    async(reportId, {rejectWithValue})=>{
        try {
            const res = await api.get(`/v1/interview/${reportId}`);
            toast.success("Report fetched successfully!");
            return res.data;
        } catch (error) {
            const errorOutput = error?.response?.data?.message;
            toast.error(errorOutput || "Server error");
            return rejectWithValue(errorOutput);
        } 
    }
);


export const getAllInterviewReportsThunk = createAsyncThunk("interview/get-all-reports",
    async(_, {rejectWithValue}) => {
        try {
            const res = await api.get("/v1/interview");
            if(res.data.data.length !== 0)
            toast.success("All reports are fetched successfully!");
            return res.data;
        } catch (error) {
            const errorOutput = error?.response?.data?.message;
            toast.error(errorOutput || "Server error");
            return rejectWithValue(errorOutput);
        }
    }
);


export const generateInterviewReportThunk = createAsyncThunk("interview/generate-report",
    async ({jobDescription, selfDescription, pdfFile}, {rejectWithValue}) => {
        try {
            const formData = new FormData();
            formData.append("jobDescription", jobDescription);
            formData.append("selfDescription", selfDescription);
            formData.append("resume", pdfFile);

            const res = await api.post("/v1/interview",formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Report generated successfully!");
            console.log(res.data)
            return res.data;
        } catch (error) {
            const errorOutput = error?.response?.data?.message;
            toast.error(errorOutput || "Server error");
            return rejectWithValue(errorOutput);
        }
    }
);


export const generateResumePdfThunk = createAsyncThunk("interview/generate-resume-pdf",
    async(interviewId, {rejectWithValue}) => {
        try {   
            const res = await api.get(`/v1/interview/resume-pdf/${interviewId}`, {responseType: "blob"});
            const pdfBlob = new Blob([res.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(pdfBlob);    
            const link = document.createElement("a");
            link.href = url;
            link.download = "resume.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Resume PDF generated successfully!");
        } catch (error) {
            const errorOutput = error?.response?.data?.message;
            toast.error(errorOutput || "Server error");
            return rejectWithValue(errorOutput);
        }
    }
);

export const deleteInterviewReportThunk = createAsyncThunk(
    "interview/delete-report",
    async (interviewId, { rejectWithValue }) => {   
        try {
            const res = await api.delete(`/v1/interview/${interviewId}`);
            toast.success("Report deleted successfully!");
            res.data.deletedReportId = interviewId;
            return res.data;
        } catch (error) {
            const errorOutput = error?.response?.data?.message;
            toast.error(errorOutput || "Server error");
            return rejectWithValue(errorOutput);
        }
    }
);