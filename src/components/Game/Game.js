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
        money: 800
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
                <h2>Crew</h2>
                <ul>
                    <li>Captain: <input placeholder="name" required /></li>
                    <li>First Mate: <input  placeholder="name" required /></li>
                    <li>Chief Engineer: <input  placeholder="name" required /></li>
                    <li>Helm: <input  placeholder="name" required /></li>
                    <li>Tactical: <input placeholder="name" required /></li>
                </ul>
                <h2>Food</h2>
                    <ul><input placeholder="pounds" required /> Cost: ⌬20 per pound</ul>
                <p id="credits">Credits: ⌬{this.state.money}</p>
                <div id="startButton">
                    <button  type="submit">Start your journey</button>
                </div>
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
