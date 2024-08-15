import { createSlice } from "@reduxjs/toolkit";

const SingleRoleSlice = createSlice({
  name: "SingleRole",
  initialState: {
    _id: "",
    name: "",
    description: "",
    permissions: [],
    createdAt: "",
    updatedAt: "",
    __v: 0,
  },
  reducers: {
    updateRole: (state, action) => {
      Object.assign(state, action.payload);
    },
    updateRoleName: (state, action) => {
      state.name = action.payload;
    },
    updateRoleDescription: (state, action) => {
      state.description = action.payload;
    },
    addPermission: (state, action) => {
      state.permissions.push(action.payload);
    },
    updatePermission: (state, action) => {
      const { index, permission } = action.payload;
      if (index >= 0 && index < state.permissions.length) {
        state.permissions[index] = permission;
      }
    },
    removePermission: (state, action) => {
      state.permissions = state.permissions.filter(
        (permission, index) => index !== action.payload
      );
    },
  },
});

export const {
  updateRole,
  updateRoleName,
  updateRoleDescription,
  addPermission,
  updatePermission,
  removePermission,
} = SingleRoleSlice.actions;

export default SingleRoleSlice.reducer;
