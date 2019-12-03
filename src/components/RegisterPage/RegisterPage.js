import React, { Component } from 'react';
import {connect} from 'react-redux';

class RegisterPage extends Component {
  state = {
    username: '',
    password: '',
    confirmPassword: '',
  };

  registerUser = (event) => {
    event.preventDefault();

    if (this.state.username && this.state.password && this.state.password === this.state.confirmPassword) {
      this.props.dispatch({
        type: 'REGISTER',
        payload: {
          username: this.state.username,
          password: this.state.password,
        },
        reload: window.location.reload(),
      });
    } else {
      this.props.dispatch({type: 'REGISTRATION_INPUT_ERROR'});
    }
  } // end registerUser

  handleInputChangeFor = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  }

  render() {
    return (
      <div>
        {this.props.errors.registrationMessage && (
          <h2
            className="alert"
            role="alert"
          >
            {this.props.errors.registrationMessage}
          </h2>
        )}
        <form onSubmit={this.registerUser} className="registerForm">
          <h1>Register User</h1>
          <div>
            <label htmlFor="username">
              Username:
              <input
                type="text"
                name="username"
                value={this.state.username}
                onChange={this.handleInputChangeFor('username')}
                className="registerInput"
              />
            </label>
          </div>
          <div>
            <label htmlFor="password">
              Password:
              <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleInputChangeFor('password')}
                className="registerInput"
              />
            </label>
          </div>
          <div>
            <label htmlFor="confirmPassword">
              Confirm:
              <input
                type="password"
                name="confirmPassword"
                value={this.state.confirmPassword}
                onChange={this.handleInputChangeFor('confirmPassword')}
                className="registerInput"
              />
            </label>
          </div>
          <div>
            <input
              className="register"
              type="submit"
              name="submit"
              value="Register"
            />
          </div>
        </form>
        <center>
          <button
            type="button"
            // className="link-button"
            onClick={() => {this.props.dispatch({type: 'SET_TO_LOGIN_MODE'})}}
            className="universalButton"
          >
            Login
          </button>
        </center>
      </div>
    );
  }
}

// Instead of taking everything from state, we just want the error messages.
// if you wanted you could write this code like this:
// const mapStateToProps = ({errors}) => ({ errors });
const mapStateToProps = state => ({
  errors: state.errors,
});

export default connect(mapStateToProps)(RegisterPage);

