import { combineReducers } from 'redux';

import * as UserActions from '../actions/user'
import jwt_decode from "jwt-decode";

const initialUserListState = []
// const initialAddUserState = {}


function getIsLoading(state = false, action) {
  switch (action.type) {
    case UserActions.START_LOADING:
      return true;
    case UserActions.END_LOADING:
      return false;
    default:
      return state;
  }
}


function getUsers(state = initialUserListState, action) {
  switch (action.type) {
    case UserActions.END_GET_USERS:
      console.log("===============reducer==========================",action)
      if(action.error){
        throw action.error
      }
      return action.payload  || state;
    default:
      return state;
  }
}

function login(state= {}, action){
  switch (action.type) {
    case UserActions.END_USER_LOGIN:
      console.log("===============reducer==========================",action)
      if(action.error){
        throw action.error
      }
      localStorage.setItem('token', action?.payload?.access?.token)
      // var decoded = jwt_decode(action?.payload?.access?.token);
      action.payload.decodedData =jwt_decode(action?.payload?.access?.token);
      return action?.payload
  
    default:
      return state;
  }
}

// function addUser(state = initialAddUserState, action){
//   switch (action.type) {
//     // case UserActions.END_GET_USERS:
//     //     return action.payload || state
      
//     case UserActions.END_GET_USERS:
//       return action.payload || state
  
//     default:
//       return state
//   }
// }




const User = combineReducers({
  userList: getUsers,
  isLoading: getIsLoading,
  login
})

export default User