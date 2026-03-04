import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import api from "../../../axios/axios";

export const loginUserThunk = createAsyncThunk(
  "user/login",
  async ({ user, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/v1/auth/login", { user, password });
      toast.success("Login successfull!");
      return res.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.message;
      toast.error(errorOutput || "Server error");
      return rejectWithValue(errorOutput);
    }
  },
);

export const registerUserThunk = createAsyncThunk(
  "user/register",
  async ({ email, username, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/v1/auth/register", {
        email,
        username,
        password,
      });
      toast.success("Register successfull!");
      return res.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.message;
      toast.error(errorOutput || "Server error");
      return rejectWithValue(errorOutput);
    }
  },
);

export const logoutUserThunk = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/v1/auth/logout");
      toast.success("Logout successfull!");
      return res.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.message;
      toast.error(errorOutput || "Server error");
      return rejectWithValue(errorOutput);
    }
  },
);

export const checkUserAuthThunk = createAsyncThunk(
  "user/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/v1/auth/me");
      console.log(res);
      return res.data;
    } catch (error) {
      console.error(error.response);
      const errorOutput = error?.response?.data?.message;
      return rejectWithValue(errorOutput);
    }
  },
);

export const updateProfileThunk = createAsyncThunk(
  "user/updateProfile",
  async (FormData, { rejectWithValue }) => {
    try {
      const res = await api.put("/v1/profile/update", FormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile updated successfully!");
      return res.data;
    } catch (error) {
      console.error(error.response);
      const errorOutput = error?.response?.data?.message;
      toast.error(errorOutput || "Server error");
      return rejectWithValue(errorOutput);
    }
  },
);

export const deleteUserThunk = createAsyncThunk(
  "user/delete",
  async (password, { rejectWithValue }) => {
    try {
      const res = await api.delete("/v1/auth/delete", { data: { password } });
      toast.success("User account deleted successfully!");
      return res.data;
    } catch (error) {
      console.error(error.response);
      const errorOutput = error?.response?.data?.message;
      toast.error(errorOutput || "Server error");
      return rejectWithValue(errorOutput);
    }
  },
);
