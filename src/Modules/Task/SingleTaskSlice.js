import { createSlice } from "@reduxjs/toolkit";

const SingleTaskSlice = createSlice({
  name: "SingleTask",
  initialState: {
    _id: "",
    name: "",
    description: "",
    priority: "",
    status: "",
    endDate: "",
    team: {
      _id: "",
      name: "",
      imageUrl: "",
      lead: {
        _id: "",
        name: "",
        email: "",
        imageUrl: "",
        role: "",
        phone: "",
      },
      members: [],
    },
    file: "",
    createdAt: "",
    updatedAt: "",
  },
  reducers: {
    updateTask: (state, action) => {
      Object.assign(state, action.payload);
    },
    updateTaskName: (state, action) => {
      state.name = action.payload;
    },
    updateDescription: (state, action) => {
      state.description = action.payload;
    },
    updatePriority: (state, action) => {
      state.priority = action.payload;
    },
    updateStatus: (state, action) => {
      state.status = action.payload;
    },
    updateEndDate: (state, action) => {
      state.endDate = action.payload;
    },
    updateTaskFile: (state, action) => {
      state.file = action.payload;
    },
    updateTeam: (state, action) => {
      state.team = { ...state.team, ...action.payload };
    },
    updateTeamLead: (state, action) => {
      state.team.lead = { ...state.team.lead, ...action.payload };
    },
    updateTeamMembers: (state, action) => {
      state.team.members = action.payload;
    },
    addTeamMember: (state, action) => {
      state.team.members.push(action.payload);
    },
    removeTeamMember: (state, action) => {
      state.team.members = state.team.members.filter(
        (member) => member._id !== action.payload
      );
    },
  },
});

export const {
  updateTask,
  updateTaskName,
  updateDescription,
  updatePriority,
  updateStatus,
  updateEndDate,
  updateTaskFile,
  updateTeam,
  updateTeamLead,
  updateTeamMembers,
  addTeamMember,
  removeTeamMember,
} = SingleTaskSlice.actions;

export default SingleTaskSlice.reducer;
