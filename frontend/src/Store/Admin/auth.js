import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  token: null,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState: initialState,
  reducers: {
    adminLogin(state) {
      state.isLoggedIn = true;
    },
    adminLogOut(state) {
      state.isLoggedIn = false;
    },
    setAdminAuthToken(state, action) {
      state.token = action.payload; // Fixed: Access `payload` from the action
    },
  },
});

// Export the actions
export const { adminLogin, adminLogOut, setAdminAuthToken } = adminAuthSlice.actions;

// Export the reducer
export const adminAuthReducer = adminAuthSlice.reducer;

// Export the slice (optional, if needed for other purposes)
export default adminAuthSlice;
