import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';

const Nav = (props) => (
  <div className="nav">
    <Link to="/home">
      <h2 className="nav-title">STAR TRAILS</h2>
    </Link>
    <div className="nav-right">
      <Link className="nav-link" to="/home">
        {/* Show this link if they are logged in or not,
        but call this link 'Home' if they are logged in,
        and call this link 'Login / Register' if they are not */}
        {props.user.id ? 'Home' : 'Login / Register'}
      </Link>
      {/* show this route only if the user is logged in. */}
        {/* {props.user.id && props.user.save_id ? 
        <Link className="nav-link" to="/game">
          Play
        </Link>: <></>} */}
      {/* Always show this link since the about page is not protected */}
      <Link className="nav-link" to="/about">
        How to Play
      </Link>
      {/* show the admin link only if the user is an admin */}
      {props.user.admin ? 
      <Link className="nav-link" to="/admin">
        Admin
      </Link>: <></>}
      {/* Show the link to the info page and the logout button if the user is logged in */}
      {props.user.id && (
        <>
          {/* <Link className="nav-link" to="/info">
            Info Page
          </Link> */}
          <LogOutButton className="nav-link"/>
        </>
      )}
    </div>
  </div>
);

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(Nav);
