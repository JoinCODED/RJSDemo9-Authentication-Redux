import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

// Components
import Login from "./Login";
import Logout from "./Logout";

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
