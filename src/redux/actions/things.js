import axios from "axios";
import { GET_THINGS, GET_PRIVATE_THINGS } from "./actionTypes";

export const fetchGarbage = () => {
  return async dispatch => {
    try {
      const res = await axios.get(
        "https://precious-things.herokuapp.com/api/things/"
      );
      const things = res.data;
      dispatch({
        type: GET_THINGS,
        payload: things
      });
    } catch (err) {
      console.error(err);
    }
  };
};

export const fetchTreasure = () => {
  return async dispatch => {
    try {
      const res = await axios.get(
        "https://precious-things.herokuapp.com/api/private-things/"
      );

      const things = res.data;
      dispatch({
        type: GET_PRIVATE_THINGS,
        payload: things
      });
    } catch (err) {
      console.error(err);
    }
  };
};
