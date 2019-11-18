import React, {Component} from 'react';
import {connect} from 'react-redux';
import './Game.css'

class Game extends Component{
    state= {
        crew1: '',
        crew2: '',
        crew3: '',
        crew4: '',
        crew5: '',
        food: 0,
        resource1: 0,
        resource2: 0,
        resource3: 0,
        resource4: 0,
        resource5: 0,
    }
    // sends all data to server and associates that save data with the current user
    createSaveAndStart = () => {
        if(window.confirm("Is everything here okay?")){
            console.log("yes");
        }
    }
    render(){
        return(
            <form onSubmit={this.createSaveAndStart}>
            <div>
                <h1>Crew</h1>
                <ul>
                    <li>Captain: <input placeholder="name" required /></li>
                    <li>First Mate: <input  placeholder="name" required /></li>
                    <li>Chief Engineer: <input  placeholder="name" required /></li>
                    <li>Helm: <input  placeholder="name" required /></li>
                    <li>Tactical: <input placeholder="name" required /></li>
                    <li><button type="submit">Start your journey</button></li>
                </ul>
            </div>
            {/* <span>{JSON.stringify(this.props,null,2)}</span> */}
            </form>
        )
    }
}

const mapReduxStateToProps = (reduxState) => {
    return reduxState;
}

export default connect(mapReduxStateToProps)(Game);
