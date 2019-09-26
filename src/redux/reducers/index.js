import { combineReducers } from "redux";

// Reducers
import thingReducer from "./thingReducer";

export default combineReducers({
  things: thingReducer
});
