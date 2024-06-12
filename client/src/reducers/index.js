import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';
import post from './post';
import game1 from './game1';

export default combineReducers({
  alert,
  auth,
  profile,
  post,
  game1
});