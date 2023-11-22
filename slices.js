import { createSlice } from "@reduxjs/toolkit";


const loginValidationSlice = createSlice({
    name: 'Validation',
    initialState: {
      token: '',
      userid: '',
      hunts: [],
    },
    reducers: {
      setToken: (state, token) => {
        state.token = token.payload;
      },
      clearAll: (state) => {
        state.token = '';
        state.userid = '';
        state.huntList = [];
      },
      setUserId: (state, userid) => {
        state.userid = userid.payload;
      },
      setHuntList: (state, hunts) => {
        state.huntList = hunts.payload;
      }
    }
  });
  
  export const { setToken, clearAll, setUserId, setHuntList } = loginValidationSlice.actions
  export default loginValidationSlice.reducer