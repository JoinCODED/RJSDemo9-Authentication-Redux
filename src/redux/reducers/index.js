import { combineReducers } from "redux";

// Reducers
import thingReducer from "./things";

export default combineReducers({
  things: thingReducer
});
