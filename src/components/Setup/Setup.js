import React, {Component} from 'react';
import {connect} from 'react-redux';
import './Setup.css';
import {withRouter} from 'react-router-dom';

class Setup extends Component{
    state= {
        captain: '',
        medic: '',
        engineer: '',
        helm: '',
        tactical: '',
        food: 0,
        batteries: 0,
        warp_coils: 0,
        antimatter_flow_regulators: 0,
        magnetic_constrictors: 0,
        plasma_injectors: 0,
        money: 950,
        available: 950,
        phaser_energy: 0,
        exceededLimit: false,
    }

    // sends all data to server and associates that save data with the current user
    createSaveAndStart = (e) => {
        e.preventDefault();
        // if the user is trying to spend more money than they have. Make them correct that
        if (this.state.exceededLimit){
            alert("You cannot be in debt. Please fix your bill accordingly")
            return 0;
        }
        // if the user confirms, create a save for the user and push to the main game page
        if(window.confirm("Is everything here okay?")){
            this.props.dispatch({type: "CREATE_SAVE", payload: this.state, history: this.props.history})
        }
    }
    
    // handles the changing of any input and changes that respective input in state
    handleChange = (e) => {
        this.setState({
            [e.target.name]: Math.floor(Number(e.target.value)),
            phaser_energy: this.state.batteries*20,
        },this.checkBalance)
        // this will keep the input box floored. Intergalatic credits don't use change!
        e.target.value = Math.floor(Number(e.target.value));
    }
    
    // changes name in state to whatever the user is inputting by field
    handleNameChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    // update the balance and check if that balance is negative
    checkBalance = () => {
        const newBalance = Math.round(this.state.money - this.state.food - this.state.warp_coils*40 - this.state.batteries*2 - this.state.antimatter_flow_regulators*10 - this.state.magnetic_constrictors*10 - this.state.plasma_injectors*10);
        (newBalance < 0) ? this.setState({available: newBalance, exceededLimit: true}) : this.setState({available: newBalance, exceededLimit: false})
    }

    render(){
        return(
            <div id="setupView">
                <form onSubmit={this.createSaveAndStart}>
                <div>
                    <h2>Crew</h2>
                    <ul>
                        <li>Captain: <input onChange={this.handleNameChange} placeholder="name" className="setUpInput" name="captain" autoComplete="off" required /></li>
                        <li>Chief of Medicine: <input onChange={this.handleNameChange} placeholder="name" className="setUpInput" name="medic" autoComplete="off" required /></li>
                        <li>Chief Engineer: <input onChange={this.handleNameChange} placeholder="name" className="setUpInput" name="engineer" autoComplete="off" required /></li>
                        <li>Helm: <input onChange={this.handleNameChange} placeholder="name" className="setUpInput" name="helm" autoComplete="off" required /></li>
                        <li>Tactical: <input onChange={this.handleNameChange} placeholder="name" className="setUpInput" name="tactical" autoComplete="off"  required /></li>
                    </ul>
                    <h2>Food</h2>
                    <ul><input onChange={this.handleChange} placeholder="pounds" type="number" min="0" name="food" className="setUpInput" autoComplete="off" required /> Cost: ⌬1 per pound</ul>
                    <h2>Ammunition</h2>
                    <ul><input onChange={this.handleChange} placeholder="batteries" type="number" min="0" name="batteries" className="setUpInput" autoComplete="off" required /> Cost: ⌬2 per battery. Each battery gets you 20 phaser blasts of energy</ul>
                    <h2>Spare Parts</h2>
                    <ul>
                    <li><input onChange={this.handleChange} placeholder="warp coils" type="number" min="0" max="9" name="warp_coils" className="setUpInput" autoComplete="off" required /> Cost: ⌬40 per warp coil</li>
                        <li><input onChange={this.handleChange} placeholder="regulators" type="number" min="0" max="3" name="antimatter_flow_regulators" className="setUpInput" autoComplete="off" required /> Cost: ⌬10 per antimatter flow regulator</li>
                        <li><input onChange={this.handleChange} placeholder="constrictors" type="number" min="0" max="3" name="magnetic_constrictors" className="setUpInput" autoComplete="off" required /> Cost: ⌬10 per magnetic constrictor</li>
                        <li><input onChange={this.handleChange} placeholder="injectors" type="number" min="0" max="3" name="plasma_injectors" className="setUpInput" autoComplete="off" required /> Cost: ⌬10 per plasma injector</li>
                    </ul>
                    <div id="bill">
                        <h2>Bill:</h2>
                        <ul>
                            <li>Food: ⌬{this.state.food}</li>
                            <li>Batteries: ⌬{this.state.batteries}</li>
                            <li>Warp Coils: ⌬{this.state.warp_coils * 40}</li>
                            <li>Antimatter Flow Regulators: ⌬{this.state.antimatter_flow_regulators * 10}</li>
                            <li>Magnetic Constrictors: ⌬{this.state.magnetic_constrictors * 10}</li>
                            <li>Plasma Injectors: ⌬{this.state.plasma_injectors * 10}</li>
                        </ul>
                    </div>
                    {/* Conditionally render Available Credits to highlight when negative */}
                    {!this.state.exceededLimit ? 
                        (<div id="availableCredits">Available Credits: ⌬{this.state.available}</div>) :
                        (<div id="availableCredits"><span className="exceeded">Available Credits: ⌬{this.state.available}</span></div>)}
                    <div id="totalCredits">Total Credits: ⌬{this.state.money}</div>
                    <div id="startButton" className="universalButton">
                        <button  className="universalButton" type="submit">Start your journey</button>
                    </div>
                </div>
                {/* <span>{JSON.stringify(this.state,null,2)}</span> */}
                </form>
            </div>
        )
    }
}

export default withRouter(connect()(Setup));
