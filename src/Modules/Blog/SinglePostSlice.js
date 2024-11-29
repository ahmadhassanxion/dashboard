import { createSlice } from "@reduxjs/toolkit";

const singlePostSlice = createSlice({
  name: "singlePost",
  initialState: {
    _id: "",
    name: "",
    content: "",
    views: 0,
    status: "draft",
    featuredImage: "",
    category: {
      _id: "",
      name: "",
      icon: "",
      createdBy: "",
      isDeleted: false,
      createdAt: "",
      updatedAt: "",
      __v: 0,
    },
    createdBy: {
      _id: "",
      name: "",
      email: "",
      password: "",
      role: "",
      phone: "",
      isAdmin: false,
      isVerified: false,
      imageUrl: "",
      createdAt: "",
      updatedAt: "",
      __v: 0,
      isDeleted: false,
    },
    comments: true,
    isDeleted: false,
    createdAt: "",
    updatedAt: "",
    __v: 0,
  },
  reducers: {
    updatePost: (state, action) => {
      // Object.assign can handle nested objects, but ensure it's done carefully
      Object.assign(state, action.payload);
    },
    updatePostContent: (state, action) => {
      state.content = action.payload;
    },
    updatePostStatus: (state, action) => {
      state.status = action.payload;
    },
    updateFeaturedImage: (state, action) => {
      state.featuredImage = action.payload;
    },
    updatePostCategory: (state, action) => {
      state.category = { ...state.category, ...action.payload };
    },
    updatePostCreator: (state, action) => {
      state.createdBy = { ...state.createdBy, ...action.payload };
    },
  },
});

export const {
  updatePost,
  updatePostContent,
  updatePostStatus,
  updateFeaturedImage,
  updatePostCategory,
  updatePostCreator,
} = singlePostSlice.actions;

export default singlePostSlice.reducer;
