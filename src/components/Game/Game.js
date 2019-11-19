import React, {Component} from 'react';
import {connect} from 'react-redux';
import './Game.css'
import { tsMethodSignature } from '@babel/types';

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
        money: 800,
        available: 800,
        exceededLimit: false,
    }
    // sends all data to server and associates that save data with the current user
    createSaveAndStart = () => {
        if(window.confirm("Is everything here okay?")){
            console.log("yes");
        }
    }
    handleFoodChange = (e) => {
        this.setState({
            food: Number(e.target.value),
            available: this.state.money - (Number(e.target.value)*.2) - this.state.resource1*10 - this.state.resource2*2 -
            this.state.resource3*10 - this.state.resource4*10 - this.state.resource5*10
        },this.checkBalance)
    }
    handleClothesChange = (e) => {
        this.setState({
            resource1: Number(e.target.value),
            available: this.state.money - this.state.food*.2 - e.target.value*10 - this.state.resource2*2 -
            this.state.resource3*10 - this.state.resource4*10 - this.state.resource5*10
        },this.checkBalance)
    }
    handleAmmoChange = (e) => {
        this.setState({
            resource2: Number(e.target.value),
            available: this.state.money - this.state.food*.2 - this.state.resource1*10 - e.target.value*2 -
            this.state.resource3*10 - this.state.resource4*10 - this.state.resource5*10
        },this.checkBalance)
    }
    handleSpare1Change = (e) => {
        this.setState({
            resource3: Number(e.target.value),
            available: this.state.money - this.state.food*.2 - this.state.resource1*10 - this.state.resource2*2 -
            e.target.value*10 - this.state.resource4*10 - this.state.resource5*10
        },this.checkBalance)
        
    }
    handleSpare2Change = (e) => {
        this.setState({
            resource4: Number(e.target.value),
            available: this.state.money - this.state.food*.2 - this.state.resource1*10 - this.state.resource2*2 -
            this.state.resource3*10 - e.target.value*10 - this.state.resource5*10
        },this.checkBalance)
        
    }
    handleSpare3Change = (e) => {
        this.setState({
            resource5: Number(e.target.value),
            available: this.state.money - this.state.food*.2 - this.state.resource1*10 - this.state.resource2*2 -
            this.state.resource3*10 - this.state.resource4*10 - e.target.value*10,
        },this.checkBalance)
        // 
    }
    checkBalance = () => {
        (this.state.available<0)?this.setState({exceededLimit: true}) : this.setState({exceededLimit: false})
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
                <ul><input onChange={this.handleFoodChange} placeholder="pounds" type="number" min="0" required /> Cost: ⌬0.20 per pound</ul>
                <h2>Clothes</h2>
                <ul><input onChange={this.handleClothesChange} placeholder="sets of clothing" type="number" min="0" required /> Cost: ⌬10 per set</ul>
                <h2>Ammo</h2>
                <ul><input onChange={this.handleAmmoChange} placeholder="boxes of ammo" type="number" min="0" required /> Cost: ⌬2 per box</ul>
                <h2>Spare Parts</h2>
                <ul>
                    <li><input onChange={this.handleSpare1Change} placeholder="number" type="number" min="0" required /> Cost: ⌬10 per </li>
                    <li><input onChange={this.handleSpare2Change} placeholder="number" type="number" min="0" required /> Cost: ⌬10 per </li>
                    <li><input onChange={this.handleSpare3Change} placeholder="number" type="number" min="0" required /> Cost: ⌬10 per </li>
                </ul>
                <div id="bill">
                    <h2>Bill:</h2>
                    <ul>
                        <li>Food: ⌬{this.state.food * .2}</li>
                        <li>Clothes: ⌬{this.state.resource1 * 10}</li>
                        <li>Ammo: ⌬{this.state.resource2 * 2}</li>
                        <li>Spare Part 1: ⌬{this.state.resource3 * 10}</li>
                        <li>Spare Part 2: ⌬{this.state.resource4 * 10}</li>
                        <li>Spare Part 3: ⌬{this.state.resource5 * 10}</li>
                    </ul>
                </div>
                {/* <div id="totalCredits">Total Credits: ⌬{this.state.money}</div> */}
                {/* Conditionally render Available Credits to highlight when negative */}
                {!this.state.exceededLimit ? (<div id="availableCredits">Available Credits: ⌬{this.state.available}</div>) :
                (<div id="availableCredits"><span class="exceeded">Available Credits: ⌬{this.state.available}</span></div>)}
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
