import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  name: "",
  slug: "",
  content: "",
  category: {
    _id: "",
    name: "",
    icon: "",
  },
  featuredImage: "",
  status: "draft",
  comments: false,
  websites: [],
  metaTitle: "",
  metaDescription: "",
  focusKeywords: [],
  createdBy: {
    _id: "",
    name: "",
    imageUrl: "",
  },
  views: 0,
  isLoading: false,
  error: null
};

const SinglePostSlice = createSlice({
  name: "SinglePost",
  initialState,
  reducers: {
    setPost: (state, action) => {
      return { ...state, ...action.payload, isLoading: false, error: null };
    },
    updatePost: (state, action) => {
      return { ...state, ...action.payload, isLoading: false, error: null };
    },
    updateFeaturedImage: (state, action) => {
      state.featuredImage = action.payload;
    },
    updatePostContent: (state, action) => {
      state.content = action.payload;
    },
    updatePostStatus: (state, action) => {
      state.status = action.payload;
    },
    updatePostCategory: (state, action) => {
      state.category = { ...state.category, ...action.payload };
    },
    clearPost: () => {
      return initialState;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    }
  },
});

export const { 
  setPost, 
  updatePost, 
  updateFeaturedImage,
  updatePostContent,
  updatePostStatus,
  updatePostCategory,
  clearPost, 
  setLoading, 
  setError 
} = SinglePostSlice.actions;

export default SinglePostSlice.reducer;
