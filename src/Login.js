import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

// Actions
import { login } from "./redux/actions";

class Login extends Component {
  state = {
    username: "",
    password: ""
  };

  handleChange = event =>
    this.setState({ [event.target.name]: event.target.value });

  handleSubmit = event => {
    event.preventDefault();
    this.props.login(this.state);
  };

  render() {
    const { username, password } = this.state;
    return (
      <form onSubmit={this.handleSubmit} className="form-inline">
        <input
          className="form-control mr-sm-2"
          type="text"
          name="username"
          value={username}
          placeholder="Username"
          onChange={this.handleChange}
        />
        <input
          className="form-control mr-sm-2"
          type="password"
          name="password"
          value={password}
          placeholder="Password"
          onChange={this.handleChange}
        />
        <button className="btn btn-primary my-2 my-sm-0 mr-2" type="submit">
          Login
        </button>
        <Link to="/signup" className="btn btn-success my-2 my-sm-0">
          Signup
        </Link>
      </form>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  login: userData => dispatch(login(userData))
});

export default connect(null, mapDispatchToProps)(Login);
