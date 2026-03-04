import { createSlice } from"@reduxjs/toolkit";
import { deleteInterviewReportThunk, generateInterviewReportThunk, generateResumePdfThunk, getAllInterviewReportsThunk, getInterviewReportByIdThunk } from "./interview.thunk";


const initialState = {
    allInterviewReports: [],
    interviewReport: null,
    loading: false,
    pdfLoading: false,
    navLoading: false,   
}

const interviewSlice = createSlice({
    name: "interview",
    initialState,
    extraReducers: (builder) => {
        // get report by id thunk
        builder.addCase(getInterviewReportByIdThunk.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(getInterviewReportByIdThunk.fulfilled, (state, action) => {
            state.interviewReport = action.payload.data;
            state.loading = false;
        });
        builder.addCase(getInterviewReportByIdThunk.rejected, (state, action) => {
            state.loading = false;
        });

        // get all reports thunk
        builder.addCase(getAllInterviewReportsThunk.pending, (state, action) => {
            state.navLoading = true;
        });
        builder.addCase(getAllInterviewReportsThunk.fulfilled, (state, action) => {
            state.allInterviewReports = action.payload.data;
            state.navLoading = false;
        });
        builder.addCase(getAllInterviewReportsThunk.rejected, (state, action) => {
            state.navLoading = false;
        });

        // generate a interview report thunk
        builder.addCase(generateInterviewReportThunk.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(generateInterviewReportThunk.fulfilled, (state, action) => {
            state.interviewReport = action.payload.data;
            state.allInterviewReports.unshift({title: action.payload.data.title, _id: action.payload.data._id});
            state.loading = false;
        });
        builder.addCase(generateInterviewReportThunk.rejected, (state, action) => {
            state.loading = false;
        });

        // generate resume PDF thunk
        builder.addCase(generateResumePdfThunk.pending, (state, action) => {
            state.pdfLoading = true;
        });
        builder.addCase(generateResumePdfThunk.fulfilled, (state, action) => {
            state.pdfLoading = false;
        });
        builder.addCase(generateResumePdfThunk.rejected, (state, action) => {
            state.pdfLoading = false;
        });

        // delete interview report thunk
        builder.addCase(deleteInterviewReportThunk.pending, (state, action) => {
            state.navLoading = true;
        });
        builder.addCase(deleteInterviewReportThunk.fulfilled, (state, action) => {
            state.allInterviewReports = state.allInterviewReports.filter(report => report._id !== action.meta.arg);
            if(state.interviewReport._id === action.meta.arg) {
                state.interviewReport = [];
            }
            state.navLoading = false;
        });
        builder.addCase(deleteInterviewReportThunk.rejected, (state, action) => {
            state.navLoading = false;
        });  
    }
});

export default interviewSlice.reducer;