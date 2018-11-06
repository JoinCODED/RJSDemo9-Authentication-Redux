import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

// Components
import Login from "./Login";
import Logout from "./Logout";

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
  user: state.user
});

export default connect(mapStateToProps)(Navbar);
