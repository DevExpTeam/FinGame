import axios from 'axios';
import {
  GET_GAME1,
  GET_GAME2,
  GET_GAME2_ITEMS,
  GAME_ERROR
} from './types';

axios. defaults. baseURL = 'http://localhost:5000';

// Get game1
export const getGame1 = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/game1");

    dispatch({
      type: GET_GAME1,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GAME_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get game2
export const getGame2 = () => async (dispatch) => {

};

// Get game2 items list
export const getAccountingItems = (category) => async (dispatch) => {
  try {
    const res = await axios.get('/api/game2', {
      params: { category }
    });

    dispatch({
      type: GET_GAME2_ITEMS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GAME_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
