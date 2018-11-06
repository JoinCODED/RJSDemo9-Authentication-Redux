import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

const PrivateRoute = ({ component: Component, user, redirectUrl, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      user ? <Component {...props} /> : <Redirect to={redirectUrl || "/"} />
    }
  />
);

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(PrivateRoute);
