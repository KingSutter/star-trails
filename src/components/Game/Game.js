import React, {Component} from 'react';
import {connect} from 'react-redux';
import './Game.css';

class Game extends Component{
    state= {
        crew1: '',
        crew2: '',
        crew3: '',
        crew4: '',
        crew5: '',
        food: '',
        resource1: 0,
        resource2: 0,
        resource3: 0,
        resource4: 0,
        resource5: 0,
        money: 950,
        available: 950,
        exceededLimit: false,
    }

    // sends all data to server and associates that save data with the current user
    createSaveAndStart = () => {
        if(window.confirm("Is everything here okay?")){
            console.log("yes");
        }
    }
    
    // handles the changing of any input and changes that respective input in state
    handleChange = (e) => {
        this.setState({
            [e.target.name]: Math.floor(Number(e.target.value)),
        },this.checkBalance)
        // this will keep the input box floored. Intergalatic credits don't use change!
        e.target.value = Math.floor(Number(e.target.value));
    }
    
    // update the balance and check if that balance is negative
    checkBalance = () => {
        const newBalance = Math.round(this.state.money - this.state.food - this.state.resource1*10 - this.state.resource2*2 - this.state.resource3*10 - this.state.resource4*10 - this.state.resource5*10);
        (newBalance < 0) ? this.setState({available: newBalance, exceededLimit: true}) : this.setState({available: newBalance, exceededLimit: false})
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
                <ul><input onChange={this.handleChange} placeholder="pounds" type="number" min="0" name="food" required /> Cost: ⌬1 per pound</ul>
                <h2>Clothes</h2>
                <ul><input onChange={this.handleChange} placeholder="sets of clothing" type="number" min="0" name="resource1" required /> Cost: ⌬10 per set</ul>
                <h2>Ammunition</h2>
                <ul><input onChange={this.handleChange} placeholder="batteries" type="number" min="0" name="resource2" required /> Cost: ⌬2 per battery. Each battery gets you 20 phaser blasts</ul>
                <h2>Spare Parts</h2>
                <ul>
                    <li><input onChange={this.handleChange} placeholder="number" type="number" min="0" name="resource3" required /> Cost: ⌬10 per </li>
                    <li><input onChange={this.handleChange} placeholder="number" type="number" min="0" name="resource4" required /> Cost: ⌬10 per </li>
                    <li><input onChange={this.handleChange} placeholder="number" type="number" min="0" name="resource5" required /> Cost: ⌬10 per </li>
                </ul>
                <div id="bill">
                    <h2>Bill:</h2>
                    <ul>
                        <li>Food: ⌬{Math.round(this.state.food)}</li>
                        <li>Clothes: ⌬{Math.round(this.state.resource1 * 10)}</li>
                        <li>Ammo: ⌬{Math.round(this.state.resource2 * 2)}</li>
                        <li>Spare Part 1: ⌬{Math.round(this.state.resource3 * 10)}</li>
                        <li>Spare Part 2: ⌬{Math.round(this.state.resource4 * 10)}</li>
                        <li>Spare Part 3: ⌬{Math.round(this.state.resource5 * 10)}</li>
                    </ul>
                </div>
                {/* <div id="totalCredits">Total Credits: ⌬{this.state.money}</div> */}
                {/* Conditionally render Available Credits to highlight when negative */}
                {!this.state.exceededLimit ? (<div id="availableCredits">Available Credits: ⌬{this.state.available}</div>) :
                (<div id="availableCredits"><span className="exceeded">Available Credits: ⌬{this.state.available}</span></div>)}
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
