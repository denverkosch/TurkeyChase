import { createSlice } from "@reduxjs/toolkit";


const loginValidationSlice = createSlice({
    name: 'Validation',
    initialState: {
      token: '',
      userid: ''
    },
    reducers: {
      setToken: (state, token) => {
        state.token = token.payload
      },
      clearAll: (state) => {
        state.token = ''
        state.userid = ''
      },
      setUserId: (state, userid) => {
        state.userid = userid.payload
      }
      
    }
  });
  
  export const { setToken, clearAll, setUserId } = loginValidationSlice.actions
  export default loginValidationSlice.reducer