import { SET_USER } from "../types";

const initialState = {
  user: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      localStorage.setItem("userId", action.payload.uid);
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};
