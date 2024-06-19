import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';
import post from './post';
import game1 from './game1';
import game2 from './game2';
import scores from './scores';

export default combineReducers({
  alert,
  auth,
  profile,
  post,
  game1,
  game2,
  scores,
});