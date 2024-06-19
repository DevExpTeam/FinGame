import {
  GET_GAME2,
  GET_GAME2_ITEMS,
  GAME_ERROR
} from '../actions/types';

const initialState = {
  question: "",
  answers: [],
  itemNames: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_GAME2:
      return {
        ...state,
        question: payload.question,
        answers: payload.answers,
        loading: false,
      };
    case GET_GAME2_ITEMS:
      return {
        ...state,
        itemNames: payload,
        loading: false,
      };
    case GAME_ERROR:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    default:
      return state;
  }
}