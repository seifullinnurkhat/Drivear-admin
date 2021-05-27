import { SET_USER } from "../types";

export const setUser = (payload) => ({
  type: SET_USER,
  payload: payload,
});
