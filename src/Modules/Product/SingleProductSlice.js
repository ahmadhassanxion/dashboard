import { createSlice } from "@reduxjs/toolkit";

const SingleProductSlice = createSlice({
  name: "SingleProduct",
  initialState: {
    _id: "",
    name: "",
    description: "",
    items: [],
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
    type: "",
    tone: "",
    category: "",
    status: "",
    published: false,
    isDeleted: false,
    createdAt: "",
    updatedAt: "",
    __v: 0,
  },
  reducers: {
    updateProduct: (state, action) => {
      Object.assign(state, action.payload);
    },
    updateProductItems: (state, action) => {
      state.items = action.payload;
    },
    updateProductStatus: (state, action) => {
      state.status = action.payload;
    },
    updateProductCreatedBy: (state, action) => {
      state.createdBy = { ...state.createdBy, ...action.payload };
    },
  },
});

export const {
  updateProduct,
  updateProductItems,
  updateProductStatus,
  updateProductCreatedBy,
} = SingleProductSlice.actions;

export default SingleProductSlice.reducer;
