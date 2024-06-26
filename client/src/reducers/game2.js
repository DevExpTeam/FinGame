import {
  GET_GAME2,
  GET_GAME2_ITEMS,
  GAME_ERROR
} from '../actions/types';
import { TAccount, TArray } from '../models/TAccounting';


const initialState = {
  problemArray: [],
  debitAnswer: new TArray({}),
  creditAnswer: new TArray({}),
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
        problemArray: payload.problemArray,
        debitAnswer: new TArray({ array: payload.debitDataArray.map((obj) => (new TAccount(obj))) }),
        creditAnswer: new TArray({ array: payload.creditDataArray.map((obj) => (new TAccount(obj))) }),
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