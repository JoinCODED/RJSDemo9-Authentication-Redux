import React from "react";
import { connect } from "react-redux";

// Actions
import { logout } from "./redux/actions";

const Logout = props => {
  return (
    <button className="btn btn-danger" onClick={props.logout}>
      Logout {props.user.username}
    </button>
  );
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Logout);
