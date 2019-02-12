# RJSDemo8 - Forms

[Slides](https://docs.google.com/presentation/d/1VNDFN2oIkKLUpKRZ7hkiRjyJTv3d7-Lp6eZJPZn2P5E/edit?usp=sharing)

1. Walk through the code:

   - Explain what this thing is
   - Explain that the backend has a protected route
   - Show the 401

#### Basic Auth

3. Show that `Login.js` doesn't do anything yet.
   Add a login action:

`authActions.js`

```javascript
export const login = userData => {
  return async dispatch => {
    try {
      const res = await axios.post(
        "https://precious-things.herokuapp.com/login/",
        userData
      );
      const user = res.data;
      // For now just log user
      console.log(user);
    } catch (err) {
      console.error(err);
    }
  };
};
```

4. Connect action to `Login.js`. Show the token being logged.

```javascript
...
  handleSubmit = event => {
    event.preventDefault();
    this.props.login(this.state);
  }
...
const mapDispatchToProps = dispatch => ({
  login: userData => dispatch(actionCreators.login(userData))
});

export default connect(
  null,
  mapDispatchToProps
)(Login);
```

5. Explain JWT. Install `jwt-decode`. Decode the token. Set the user:

```bash
$ yarn add jwt-decode
```

`authActions.js`

```javascript
...
const user = res.data;
console.log(jwt_decode(user.token)))
...
```

2. Wire up some redux:

`actionTypes.js`

```javascript
export const SET_CURRENT_USER = "SET_CURRENT_USER";
```

`authReducer.js`

```javascript
import * as actionTypes from "../actions/actionTypes";

const initialState = {
  user: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_USER:
      return {
        ...state,
        user: action.payload
      };

    default:
      return state;
  }
};
```

`reducers/index.js`

```javascript
import thingReducer from "./thingReducer";
import authReducer from "./authReducer";

export default combineReducers({
  things: thingReducer,
  auth: authReducer
});
```

`authActions.js`

```javascript
// NOT exported.
// Will only be used internally by other actions.
const setCurrentUser = token => {
  let user = jwt_decode(token);
  return {
    type: actionTypes.SET_CURRENT_USER,
    payload: user
  };
};
```

`actions/index.js`

```javascript
// Nothing to export yet
export {} from "./authActions";
```

```javascript
...
const user = res.data;
dispatch(setCurrentUser(user.token));
...
```

6. Still not able to make the request! Time to set the token in the axios header:

`authActions.js`

```javascript
const setCurrentUser = token => {
  axios.defaults.headers.common.Authorization = `jwt ${token}`;
  let user = jwt_decode(token)
  return {
    type: actionTypes.SET_CURRENT_USER,
    payload: user
  };
}
...
```

#### Signup

7. Implement signup action:

`authActions.js`

```javascript
export const signup = userData => {
  return dispatch => {
    try {
      const res = await axios.post(
        "https://precious-things.herokuapp.com/signup/",
        userData
      )
      const user = res.data;
      dispatch(setCurrentUser(user.token));
    } catch (err) {
      console.error(err)
    }
  };
};
```

8. Connect to `Signup.js`. This will work BUT THE UX IS BAD (no indication that it worked!):

```javascript
...
handleSubmit = event => {
    event.preventDefault();
    this.props.signup(this.state);
}
...
const mapDispatchToProps = dispatch => ({
  signup: userData => dispatch(actionCreators.signup(userData))
});

export default connect(
  null,
  mapDispatchToProps
)(Signup);
```

#### UX Features

##### Logout Button

1. Logout Component:

`Logout.js`

```javascript
import React from "react";
import { connect } from "react-redux";

const Logout = props => {
  return (
    <button className="btn btn-danger" onClick={() => alert("LOGOUT!!")}>
      Logout {props.user.username}
    </button>
  );
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(Logout);
```

2. Conditional render:

`Navbar.js`

```javascript
const Navbar = props => {
  return (
    <nav className="navbar navbar-dark bg-dark">
      <Link to="/" className="navbar-brand">
        Navbar
      </Link>
      {props.user ? <Logout /> : <Login />}
    </nav>
  );
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(Navbar);
```

3. Logout action:

`authActions.js`

```javascript
const setCurrentUser = token => {
  let user;
  if (token) {
    axios.defaults.headers.common.Authorization = `jwt ${token}`;
    user = jwt_decode(token)
  } else {
    delete axios.defaults.headers.common.Authorization;
    user = null;
  }

  return {
    type: actionTypes.SET_CURRENT_USER,
    payload: user
  };
}
...
export const logout = () => setCurrentUser();
```

4. Wire logout button:

`Logout.js`

```javascript
// Actions
import * as actionCreators from "./store/actions";
...
<button className="btn btn-danger" onClick={props.logout}>
    Logout {props.user.username}
</button>
...
const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(actionCreators.logout())
});
```

##### DO NOT SHOW USERS THINGS THEY CAN'T USE!

1. Conditionally render the treasure button:

`Home.js`

```javascript
const Home = props => {
  return (
    ...
    {props.user && (
    <Link to="/treasure" className="btn btn-lg btn-warning mx-auto">
        TREASURE
    </Link>
    )}
    ...
  );
};

const mapStateToProps = state => ({
  user: state.auth.user
});
```

##### Redirect after signup

1. Demonstrate the `history` object in `Singup.js`. Explain where it came from:

```javascript
...
render() {
    const { username, email, password } = this.state;
    console.log(this.props.history);
    ...
}
...
```

to

```javascript
...
render() {
    const { username, email, password } = this.state;
    this.props.history.push('/');
    ...
}
...
```

2. Modify action to accept `history`:

`authActions.js`

```javascript
export const signup = (userData, history) => {
  return dispatch => {
    ...
    const user = res.data;
    dispatch(setCurrentUser(user.token));
    history.push("/");
    ...
  };
};
```

`Signup.js`

```javascript
class Signup extends Component {
  ...
  handleSubmit = event => {
    event.preventDefault();
    this.props.signup(this.state, this.props.history);
  }
  ...
}

const mapDispatchToProps = dispatch => ({
  signup: (userData, history) =>
    dispatch(actionCreators.signup(userData, history))
});
```

##### Private and Public-ONLY pages

Don't allow users to access pages they can't use! Redirect from private and public ONLY pages!

1.  Redirect from `/treasure` :

`Treasure.js`

```javascript
...
render() {
  ...
  if (!this.props.user) return <Redirect to="/login" />;
  ...
}
...
const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(Treasure);
```

2.  Redirect from `Signup.js`:

`Signup.js`

```javascript
...
render() {
  ...
  if (this.props.user) return <Redirect to="/" />;
  ...
}
...
const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(Signup);
```

##### Persistent Login

If the page refreshes after sign in, I should STILL be signed in!

1. Store the token in local storage:

`authActions.js`

```javascript
const setAuthToken = token => {
  localStorage.setItem("treasureToken", token);
  axios.defaults.headers.common.Authorization = `jwt ${token}`;
};

const setCurrentUser = token => {
  let user;
  if (token) {
    localStorage.setItem("token", token);
    axios.defaults.headers.common.Authorization = `jwt ${token}`;
    user = jwt_decode(token);
  } else {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common.Authorization;
    user = null;
  }

  return {
    type: actionTypes.SET_CURRENT_USER,
    payload: user
  };
};
```

2. Add an action that checks for a token in localstorage:

`authActions.js`

```javascript
export const checkForExpiredToken = () => {
  return dispatch => {
    // Check for token expiration
    const token = localStorage.getItem("token");

    if (token) {
      const currentTimeInSeconds = Date.now() / 1000;

      // Decode token and get user info
      const user = jwt_decode(token);

      // Check token expiration
      if (user.exp >= currentTimeInSeconds) {
        // Set user
        dispatch(setCurrentUser(token));
      } else {
        dispatch(logout());
      }
    }
  };
};
```

3. Call the action from `componentDidMount` in `App.js`:

```javascript
class App extends Component {
  componentDidMount() {
    this.props.checkToken();
  }
  ...
}

const mapDispatchToProps = dispatch => ({
  checkToken: () => dispatch(actionCreators.checkForExpiredToken())
});

export default connect(
  null,
  mapDispatchToProps
)(App);
```
