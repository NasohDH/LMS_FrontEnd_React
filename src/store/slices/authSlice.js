import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: '',
  password: '',
  userType: 'student',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setEmail(state, action) {
      state.email = action.payload;
    },
    setPassword(state, action) {
      state.password = action.payload;
    },
    setUserType(state, action) {
      state.userType = action.payload;
    },
  },
});

export const { setEmail, setPassword, setUserType } = authSlice.actions;

export default authSlice.reducer; 