import { configureStore } from "@reduxjs/toolkit";
import { userAuthReducer } from "./User/auth"; // Adjust the path if needed
import { commonInfoReducer } from "./CommonInfo/commonInfo";
import { adminAuthReducer } from "./Admin/auth";


export const Store = configureStore({
  reducer: {
    userAuth: userAuthReducer,
    adminAuth:adminAuthReducer,
    commonInfo:commonInfoReducer
  },
});
