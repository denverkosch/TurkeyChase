import { createSlice } from "@reduxjs/toolkit";


const loginValidationSlice = createSlice({
    name: 'Validation',
    initialState: {
      token: ''
    },
    reducers: {
      setToken: (state, token) => {
        state.token = token.payload
      },
      clearToken: (state) => {
        state.token = ''
      },
    }
  });
  
  export const { setToken, clearToken } = loginValidationSlice.actions
  export default loginValidationSlice.reducer