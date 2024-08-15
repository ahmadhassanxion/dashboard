import { createSlice } from "@reduxjs/toolkit";

const SingleTeamSlice = createSlice({
  name: "SingleTeam",
  initialState: {
    _id: "",
    name: "",
    lead: {
      _id: "",
      name: "",
      email: "",
      role: "",
      phone: "",
    },
    members: [],
    imageUrl: "",
    createdAt: "",
    updatedAt: "",
  },
  reducers: {
    updateTeam: (state, action) => {
      Object.assign(state, action.payload);
    },
    updateTeamImage: (state, action) => {
      state.imageUrl = action.payload;
    },
    updateLead: (state, action) => {
      state.lead = { ...state.lead, ...action.payload };
    },
    updateMembers: (state, action) => {
      state.members = action.payload;
    },
    addMember: (state, action) => {
      state.members.push(action.payload);
    },
    removeMember: (state, action) => {
      state.members = state.members.filter(
        (member) => member._id !== action.payload
      );
    },
  },
});

export const {
  updateTeam,
  updateTeamImage,
  updateLead,
  updateMembers,
  addMember,
  removeMember,
} = SingleTeamSlice.actions;

export default SingleTeamSlice.reducer;
