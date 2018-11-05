import { combineReducers } from "redux";

// Reducers
import thingReducer from "./things";
import authReducer from "./auth";

export default combineReducers({
  things: thingReducer,
  user: authReducer
});
