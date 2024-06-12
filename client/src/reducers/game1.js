import {
  GET_GAME1,
  GAME1_ERROR
} from '../actions/types';

const initialState = {
  game1: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_GAME1:
      return {
        ...state,
        game1: payload,
        loading: false,
      };
    case GAME1_ERROR:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    default:
      return state;
  }
}