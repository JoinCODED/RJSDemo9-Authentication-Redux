import { GET_THINGS, GET_PRIVATE_THINGS } from "../actions/actionTypes";

const initialState = {
  public: [],
  private: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_THINGS:
      return {
        ...state,
        public: action.payload
      };

    case GET_PRIVATE_THINGS:
      return {
        ...state,
        private: action.payload
      };

    default:
      return state;
  }
};

export default reducer;
