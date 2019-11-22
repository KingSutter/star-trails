import React, {Component} from 'react';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import { withRouter } from "react-router";
import './UserPage.css';


// this could also be written with destructuring parameters as:
// const UserPage = ({ user }) => (
// and then instead of `props.user.username` you could use `user.username`

class UserPage extends Component {
  // componentDidMount(){
  //   document.body.style.backgroundImage = "url('static/media/warpSpeed.1deee33f.gif')";
  //   document.body.style.backgroundRepeat = "no-repeat";
  //   document.body.style.backgroundSize = "cover"
  // }
  // componentWillUnmount(){
  //   document.body.style.backgroundImage = "url(static/media/space.c11a4173.jpg)";
  // }
  render(){
    return (
      <div className="containter">
        <h1 id="welcome">
          Welcome, { this.props.user.username }!
        </h1>
        <button onClick={()=>{this.props.history.push('/setup')}} className="universalButton">New game</button><br/><br/>
        <LogOutButton className="log-in" />
      </div>
      )
    }
}

// Instead of taking everything from state, we just want the user info.
// if you wanted you could write this code like this:
// const mapStateToProps = ({user}) => ({ user });
const mapStateToProps = state => ({
  user: state.user,
});

// this allows us to use <App /> in index.js
export default withRouter(connect(mapStateToProps)(UserPage));
