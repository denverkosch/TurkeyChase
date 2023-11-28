import { createSlice } from "@reduxjs/toolkit";


const loginValidationSlice = createSlice({
    name: 'Validation',
    initialState: {
      token: '',
    },
    reducers: {
      setToken: (state, token) => {
        state.token = token.payload;
      },
      clearAll: (state) => {
        state.token = '';
      },
    }
  });
  
  export const { setToken, clearAll, } = loginValidationSlice.actions
  export default loginValidationSlice.reducer