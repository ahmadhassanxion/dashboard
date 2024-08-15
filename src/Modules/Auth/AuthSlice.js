import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
  name: "Auth",
  initialState: {
    token: null,
    user: {
      _id: null,
      name: null,
      email: null,
      password: null,
      role: null,
      phone: null,
      isAdmin: false,
      isVerified: false,
      imageUrl: null,
      createdAt: null,
      updatedAt: null,
      __v: 0,
    },
  },
  reducers: {
    updateAuthSlice: (state, action) => {
      Object.assign(state, action.payload);
    },
    logout: (state) => {
      state.token = null;
      state.user = {
        _id: null,
        name: null,
        email: null,
        password: null,
        role: null,
        phone: null,
        isAdmin: false,
        isVerified: false,
        imageUrl: null,
        createdAt: null,
        updatedAt: null,
        __v: 0,
      };
    },
  },
});

export const { updateAuthSlice, logout } = AuthSlice.actions;

export default AuthSlice.reducer;
