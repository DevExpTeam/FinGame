import axios from 'axios';
import {
  GET_GAME1,
  GET_GAME2,
  GET_GAME2_ITEMS,
  GAME_ERROR
} from './types';

axios. defaults. baseURL = process.env.REACT_APP_BACKEND_URL;

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
  try {
    const res = await axios.get('/api/game2', {
      params: { category: "main" }
    });

    dispatch({
      type: GET_GAME2,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GAME_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
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
