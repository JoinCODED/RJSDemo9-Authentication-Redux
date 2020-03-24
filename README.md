# RJSDemo9 - Authentication

1. Walk through the code:

   - Explain what this thing is
   - Explain that the backend has a protected route
   - Show the 401

#### Basic Auth

2. Show that `Login.js` doesn't do anything yet.
   Add a login action:

   `auth.js`

   ```javascript
   export const login = userData => async dispatch => {
       try {
         const res = await instance.post("/login/", userData);
         // For now just log response
         console.log(res.data);
       } catch (err) {
         console.error(err);
       }
     };
   };
   ```

3. Connect action to `Login.js`. Show the token being logged. (username: `khalid`, password: `kalesalad`)

   ```javascript
   import { login } from './redux/actions'
   ...
     handleSubmit = event => {
       event.preventDefault();
       this.props.login(this.state);
     }
   ...
   const mapDispatchToProps = dispatch => ({
     login: userData => dispatch(login(userData))
   });

   export default connect(
     null,
     mapDispatchToProps
   )(Login);
   ```

4. Explain JWT. Install `jwt-decode`. Decode the token. Set the user:

   ```bash
   $ yarn add jwt-decode
   ```

   `actions/auth.js`

   ```javascript
   ...
   const { token } = res.data;
   console.log(decode(token)))
   ...
   ```

5. Wire up some redux:

   `actions/actionTypes.js`

   ```javascript
   export const SET_CURRENT_USER = "SET_CURRENT_USER";
   ```

   `reducers/user.js`

   ```javascript
   import { SET_CURRENT_USER } from "../actions/actionTypes";

   const initialState = null;

   export default (state = initialState, action) => {
     switch (action.type) {
       case SET_CURRENT_USER:
         return action.payload;

       default:
         return state;
     }
   };
   ```

   `reducers/index.js`

   ```javascript
   import thingReducer from "./things";
   import userReducer from "./user";

   export default combineReducers({
     things: thingReducer,
     user: userReducer
   });
   ```

   `actions/auth.js`

   ```javascript
   // NOT exported.
   // Will only be used internally by other actions.
   const setCurrentUser = token => {
     const user = decode(token);
     return {
       type: actionTypes.SET_CURRENT_USER,
       payload: user
     };
   };
   ```

   ```javascript
   const user = res.data;
   dispatch(setCurrentUser(user.token));
   ```

6. Still not able to make the request! Time to set the token in the axios header:

   `actions/auth.js`

   ```javascript
   const setAuthToken = token => {
     instance.defaults.headers.Authorization = `jwt ${token}`;
   };

   const setCurrentUser = token => {
     setAuthToken(token);
     const user = decode(token);
     return {
       type: actionTypes.SET_CURRENT_USER,
       payload: user
     };
   };
   ```

#### Signup

7. Implement signup action:

   `actions/auth.js`

   ```javascript
   export const signup = userData => dispatch => {
      try {
        const res = await instance.post("/signup/", userData);
        const { token } = res.data;
        dispatch(setCurrentUser(token));
      } catch (err) {
        console.error(err)
      }
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
     signup: userData => dispatch(signup(userData))
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

   const Logout = ({ user }) => {
     return (
       <button className="btn btn-danger" onClick={() => alert("LOGOUT!!")}>
         Logout {user.username}
       </button>
     );
   };

   const mapStateToProps = ({ user }) => ({
     user
   });

   export default connect(mapStateToProps)(Logout);
   ```

2. Conditional render:

   `Navbar.js`

   ```javascript
   const Navbar = ({ user }) => {
     return (
       <nav className="navbar navbar-dark bg-dark">
         <Link to="/" className="navbar-brand">
           Navbar
         </Link>
         {user ? <Logout /> : <Login />}
       </nav>
     );
   };

   const mapStateToProps = ({ user }) => ({
     user
   });

   export default connect(mapStateToProps)(Navbar);
   ```

3. Logout action:

   `actions/auth.js`

   ```javascript
    const setCurrentUser = token => {
      setAuthToken(token);

      const user = token ? decode(token) : null;

      return {
        type: SET_CURRENT_USER,
        payload: user
      };
    };
   ...
   export const logout = () => setCurrentUser();
   ```

4. Wire logout button:

   `Logout.js`

   ```javascript
   // Actions
   import { logout } from "./redux/actions";
   ...
   <button className="btn btn-danger" onClick={logout}>
       Logout {user.username}
   </button>
   ...
   const mapDispatchToProps = dispatch => ({
     logout: () => dispatch(logout())
   });
   ```

##### DO NOT SHOW USERS THINGS THEY CAN'T USE!

1. Conditionally render the treasure button:

   `Home.js`

   ```javascript
   const Home = ({user}) => {
     return (
       ...
       {user && (
       <Link to="/treasure" className="btn btn-lg btn-warning mx-auto">
           TREASURE
       </Link>
       )}
       ...
     );
   };

   const mapStateToProps = ({user}) => ({
     user
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

   `actions/auth.js`

   ```javascript
    export const signup = (userData, history) => async dispatch => {
      ...
      const user = res.data;
      dispatch(setCurrentUser(user.token));
      history.push("/");
      ...
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
       dispatch(signup(userData, history))
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
    const mapStateToProps = ({user}) => ({
      user
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
    const mapStateToProps = ({user}) => ({
      user
    });

    export default connect(mapStateToProps)(Signup);
    ```

##### Persistent Login

If the page refreshes after sign in, I should STILL be signed in!

1. Store the token in local storage:

   `actions/auth.js`

   ```javascript
   const setAuthToken = token => {
     if (token) {
       localStorage.setItem("token", token);
       instance.defaults.headers.Authorization = `jwt ${token}`;
     } else {
       delete instance.defaults.headers.Authorization;
       localStorage.removeItem("token");
     }
   };
   ```

2. Add an action that checks for a token in localstorage:

   `actions/auth.js`

   ```javascript
   export const checkForExpiredToken = () => {
     // Get the token from local storage
     const token = localStorage.getItem("token");

     if (token) {
       const currentTimeInSeconds = Date.now() / 1000;

       // Decode token and get user info
       const user = decode(token);

       // Check token expiration
       if (user.exp >= currentTimeInSeconds) {
         // Set user
         return setCurrentUser(token);
       }
     }

     return setCurrentUser();
   };
   ```

3. Call the action from `redux/index.js`:

   ```javascript
   // Actions
   import { checkForExpiredToken } from "./actions";

   const composeEnhancers =
     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

   const store = createStore(
     rootReducer,
     composeEnhancers(applyMiddleware(thunk))
   );

   store.dispatch(checkForExpiredToken());
   ```
