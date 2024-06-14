import axios from 'axios';
import {
  GET_GAME1,
  GAME1_ERROR
} from './types';

axios. defaults. baseURL = 'http://localhost:5000';

// Get posts
export const getGame1 = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/game1");

    dispatch({
      type: GET_GAME1,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GAME1_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
