import { createSlice } from "@reduxjs/toolkit";

const SingleUserSlice = createSlice({
  name: "SingleUser",
  initialState: {
    _id: "",
    name: "",
    email: "",
    password: "",
    role: {
      _id: "",
      name: "",
      description: "",
      permissions: [],
      createdAt: "",
      updatedAt: "",
      __v: 0,
    },
    phone: "",
    isAdmin: false,
    isVerified: false,
    imageUrl: "",
    createdAt: "",
    updatedAt: "",
    __v: 0,
  },
  reducers: {
    updateUser: (state, action) => {
      // Object.assign can handle nested objects, but ensure it's done carefully
      Object.assign(state, action.payload);
    },
    updateUserImage: (state, action) => {
      state.imageUrl = action.payload;
    },
    updateUserRole: (state, action) => {
      state.role = { ...state.role, ...action.payload };
    },
  },
});

export const { updateUser, updateUserImage, updateUserRole } =
  SingleUserSlice.actions;

export default SingleUserSlice.reducer;
