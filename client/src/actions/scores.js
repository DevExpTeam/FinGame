import axios from 'axios';
import {
  GET_SCORES,
  SCORES_ERROR,
  POST_ERROR
} from './types';

axios. defaults. baseURL = process.env.REACT_APP_BACKEND_URL;

// Get scores
export const getScores = (gameType, userEmail) => async (dispatch) => {
  try {
    const res = await axios.get('/api/scores', {
      params: { gameType, userEmail }
    });

    dispatch({
      type: GET_SCORES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: SCORES_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add scores
export const addScores = (formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const res = await axios.post('/api/scores', formData, config);
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};