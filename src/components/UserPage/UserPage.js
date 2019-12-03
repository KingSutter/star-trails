import React, {Component} from 'react';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import { withRouter } from "react-router";

class UserPage extends Component {
  state = {
    confimation: false,
  }
  handleNewGame = () => {
    // if user already has a save - confirm with user. Else just go to the setup page
    if (this.props.user.save_id !== null){
      this.setState({confimation: true})
    }else{this.props.history.push('/setup')}
  }
  render(){
    return (
      <div className="userPageView">
        <h1 id="welcome">Welcome, { this.props.user.username }!</h1>
        {!this.state.confimation ? (
        <>
        <br/><br/>
        <button onClick={this.handleNewGame} className="universalButton">New game</button><br/><br/>
        </>
        ) : (
          <>
          <span>You are about to start a new game. Are you sure?</span><br/><br/>
          <button onClick={()=>{this.setState({confimation: false})}} className="universalButton">Cancel</button>
          <button onClick={()=>{this.props.history.push('/setup')}} className="universalButton">Confirm</button><br/><br/>
          </>
        )}
        {this.props.user.save_id ? (<><button onClick={()=>{this.props.history.push('/game')}} className="universalButton">Continue</button><br/><br/></>):(<></>)}
        <LogOutButton className="log-in" />
      </div>
      )
    }
}

const mapStateToProps = state => ({
  user: state.user,
});

// this allows us to use <App /> in index.js
export default withRouter(connect(mapStateToProps)(UserPage));
