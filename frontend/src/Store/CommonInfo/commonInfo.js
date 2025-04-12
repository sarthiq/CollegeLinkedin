import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userType: "admin", //Admin can also
};

export const commonInfoSlice = createSlice({
  name: "commonInfo",
  initialState: initialState,
  reducers: {
    setUserType(state) {
      state.userType = "user";
    },
    setAdminType(state) {
      state.userType = "admin";
    },
  },
});


export const {setUserType,setAdminType}=commonInfoSlice.actions;
export const commonInfoReducer=commonInfoSlice.reducer;
