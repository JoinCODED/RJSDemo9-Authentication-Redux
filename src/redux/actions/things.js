import { GET_THINGS, GET_PRIVATE_THINGS } from "./actionTypes";

import instance from "./instance";

export const fetchGarbage = () => async dispatch => {
  try {
    const res = await instance.get("/api/things/");
    const things = res.data;
    dispatch({
      type: GET_THINGS,
      payload: things
    });
  } catch (err) {
    console.error(err);
  }
};

export const fetchTreasure = () => async dispatch => {
  try {
    const res = await instance.get("/api/private-things/");

    const things = res.data;
    dispatch({
      type: GET_PRIVATE_THINGS,
      payload: things
    });
  } catch (err) {
    console.error(err);
  }
};
