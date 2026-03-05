import { createSlice } from "@reduxjs/toolkit";
import {
  checkUserAuthThunk,
  deleteUserThunk,
  loginUserThunk,
  logoutUserThunk,
  registerUserThunk,
  updateProfileThunk,
} from "./user.thunk";

const initialState = {
  user: null,
  loading: true,
  profileLoading: false,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    // LOGIN THUNK REDUCER
    builder.addCase(loginUserThunk.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(loginUserThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data;
      state.isAuthenticated = true;
    });
    builder.addCase(loginUserThunk.rejected, (state, action) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    });

    // REGISTER THUNK REDUCER
    builder.addCase(registerUserThunk.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(registerUserThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data;
      state.isAuthenticated = true;
    });
    builder.addCase(registerUserThunk.rejected, (state, action) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    });

    // LOGOUT THUNK REDUCER
    builder.addCase(logoutUserThunk.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(logoutUserThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    });
    builder.addCase(logoutUserThunk.rejected, (state, action) => {
      state.loading = false;
    });

    // CHECK USER AUTH THUNK REDUCER
    builder.addCase(checkUserAuthThunk.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(checkUserAuthThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data;
      state.isAuthenticated = true;
    });
    builder.addCase(checkUserAuthThunk.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    });

    // UPDATE PROFILE THUNK REDUCER (to be implemented)
    builder.addCase(updateProfileThunk.pending, (state, action) => {
      state.profileLoading = true;
    });
    builder.addCase(updateProfileThunk.fulfilled, (state, action) => {
      state.profileLoading = false;
      state.user = action.payload.data;
    });
    builder.addCase(updateProfileThunk.rejected, (state, action) => {
      state.profileLoading = false;
    });

    // DELETE USER THUNK REDUCER (to be implemented)
    builder.addCase(deleteUserThunk.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteUserThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    });
    builder.addCase(deleteUserThunk.rejected, (state, action) => {
      state.loading = false;
    });
  },
});

export default userSlice.reducer;
