import { configureStore } from "@reduxjs/toolkit";
import  GlobalSlice from "../Modules/Global/GlobalSlice.js";
import AuthSlice from "../Modules/Auth/AuthSlice.js";
import SingleUserSlice from "../Modules/UserPage/SingleUserSlice.js";
import SingleTeamSlice from "../Modules/Team/SingleTeamSlice.js";
import SingleTaskSlice from "../Modules/Task/SingleTaskSlice.js";
import SingleRoleSlice from "../Modules/Role/SingleRoleSlice.js";
import SingleProductSlice from "../Modules/Product/SingleProductSlice.js";
import SinglePostSlice from "../Modules/Blog/SinglePostSlice.js";
const store = configureStore({
  reducer: {
    GlobalSlice,
    AuthSlice,
    SingleUserSlice,
    SingleTeamSlice,
    SingleTaskSlice,
    SingleRoleSlice,
    SingleProductSlice,
    SinglePostSlice,
  },
});

export default store;