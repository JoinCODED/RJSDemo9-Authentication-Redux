import { combineReducers } from "redux";

// Reducers
import thingReducer from "./things";
import userReducer from "./user";

export default combineReducers({
  things: thingReducer,
  user: userReducer
});
