import { createSlice } from "@reduxjs/toolkit";

const GlobalSlice = createSlice({
  name: "GlobalSlice",
  initialState: {
   rendered: false
  },
  reducers: {
    updateGlobal: (state) => {
     state.rendered = !state.rendered;
    },

  },
});

export const { updateGlobal } = GlobalSlice.actions;

export default GlobalSlice.reducer;
