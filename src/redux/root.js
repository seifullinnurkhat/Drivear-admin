import { combineReducers } from "redux";
import { combineEpics } from "redux-observable";
import { reducer as authReducer } from "./auth/reducer";

export const rootEpic = combineEpics();

export const rootReducer = combineReducers({
  authReducer,
});
