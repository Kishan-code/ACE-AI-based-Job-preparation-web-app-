import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./features/user/user.slice"
import interviewReducer from "./features/interview/interview.slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    interview: interviewReducer,
  },
});