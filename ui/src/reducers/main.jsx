import { combineReducers } from 'redux'

import Agreement from './agreement'
import User from './user'
import Organization from './organization'

const mainReducer = combineReducers({
  Agreement,
  User,
  Organization
});

export default mainReducer;