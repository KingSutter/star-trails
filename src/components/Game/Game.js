import React,{Component} from 'react';
import {connect} from 'react-redux';
// import ProgressBar from 'react-bootstrap/ProgressBar';
import './Game.css';
import shipflying from './shipflying2.gif'

// This is the main view the user will be at for the majority of the game
// Here, the user can manage how fast they're going, the food rations, 
// view the supply manifest, view crew status, view overall game progress,
// start a new day, and quit the game.

class Game extends Component{
    componentDidMount(){
        this.props.dispatch({type: "GET_SAVE"})
    }

    // will handle all logic for whether an event happens and send updated data to save
    handleNewDay = () => {
        const scenario = (Math.floor(Math.random() * (7 - 1) ) + 1)===1;    // if the random integer (1-14) returned is 1, an scenario will occur
        console.log(scenario)
        if (scenario){ // if the rng function returns true, run a random scenario
            let allScenarioIds = [];
            this.props.game.scenarios.forEach(scenario => {
                allScenarioIds.push(scenario.id);
            });
            console.log("all scenario ids: ",allScenarioIds);
            console.log( allScenarioIds[Math.floor(Math.random() * allScenarioIds.length)] ); 
        }
        else{
            const newSave = {
                day: this.props.game.saveData.day + 1, // next day
                distance: this.props.game.saveData.distance + 1, // travel +1 lightyear
                food: this.props.game.saveData.food - 10, // eat 10 food (-10)
                money: this.props.game.saveData.money, // the rest below will remain the same, but need to be here for the update route
                phaser_energy: this.props.game.saveData.phaser_energy,
                warp_coils: this.props.game.saveData.warp_coils,
                antimatter_flow_regulators: this.props.game.saveData.antimatter_flow_regulators,
                magnetic_constrictors: this.props.game.saveData.magnetic_constrictors,
                plasma_injectors: this.props.game.saveData.plasma_injectors,
                captain_status: this.props.game.saveData.captain_status,
                medic_status: this.props.game.saveData.medic_status,
                engineer_status: this.props.game.saveData.engineer_status,
                helm_status: this.props.game.saveData.helm_status,
                tactical_status: this.props.game.saveData.tactical_status,
            } 
            this.updateSave(newSave);
        }
    }

    // send newSave to DB and change respective values
    updateSave = (saveData) => {
        this.props.dispatch({type: "UPDATE_SAVE", payload: saveData})
    }
    render(){
        return(
            <>
            <div id="shipImage">
                {/* other link to try https://i.imgur.com/U8iGpMC.gif */}
                {/* http://i.imgur.com/1iuK86O.gif */}
                {/* dodging bullets http://www.elginpk.com/worsley1415_1/woolley/spaceship2.gif */}
                {/* chill https://media.giphy.com/media/lUlcicyv8d6G4/giphy.gif */}
                {/* https://www.google.com/search?biw=960&bih=945&tbm=isch&sxsrf=ACYBGNSqH4MGVs0i7D5YaA8bCAq_8aAl4g%3A1574215455571&sa=1&ei=H5_UXZ7EIszSsAXKwpZI&q=pixel+enterprise+gif&oq=pixel+enterprise+gif&gs_l=img.3...5534.6294..6395...1.0..0.65.300.5......0....1..gws-wiz-img.......0i8i30j0i24.EYlqo412fhU&ved=0ahUKEwjez53I2fflAhVMKawKHUqhBQkQ4dUDCAc&uact=5#imgrc=1XEjFgTvropdAM: */}
                <img src={shipflying} alt="ship" id="shipGIF" />
            </div>
            <br/>
            <div id="progressBar">
                <progress value={this.props.game.saveData.distance} max="150"/>
            </div>
            <br/>
            <div id="suppliesGraph">
                <table>
                    <caption>Resources</caption>
                    <thead>
                        <tr>
                            <td>Food</td>
                            <td>Credits</td>
                            <td>Phaser Energy</td>
                            <td>Warp Coils</td>
                            <td>Antimatter Flow Regulators</td>
                            <td>Magnetic Constrictors</td>
                            <td>Plasma Injectors</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{this.props.game.saveData.food} lbs</td>
                            <td>⌬{this.props.game.saveData.money}</td>
                            <td>{this.props.game.saveData.phaser_energy}</td>
                            <td>{this.props.game.saveData.warp_coils}</td>
                            <td>{this.props.game.saveData.antimatter_flow_regulators}</td>
                            <td>{this.props.game.saveData.magnetic_constrictors}</td>
                            <td>{this.props.game.saveData.plasma_injectors}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <br/>
            <div id="crewGraph">
                <table>
                    <caption>Crew</caption>
                    <thead>
                        <tr>
                            <td>Crew Member</td>
                            <td>Status</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Captain {this.props.game.saveData.captain}</td>
                            <td>{this.props.game.saveData.captain_status}</td>
                        </tr>
                        <tr>
                            <td>Cheif Medic {this.props.game.saveData.medic}</td>
                            <td>{this.props.game.saveData.medic_status}</td>
                        </tr>
                        <tr>
                            <td>Chief Engineer {this.props.game.saveData.engineer}</td>
                            <td>{this.props.game.saveData.engineer_status}</td>
                        </tr>
                        <tr>
                            <td>Helmsman {this.props.game.saveData.helm}</td>
                            <td>{this.props.game.saveData.helm_status}</td>
                        </tr>
                        <tr>
                            <td>Tactical Officer {this.props.game.saveData.tactical}</td>
                            <td>{this.props.game.saveData.tactical_status}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <br/>
            <footer id="buttons">
                <button onClick={this.handleNewDay}> New day</button>
            </footer>
            <span>{JSON.stringify(this.props.game.saveData,null,2)}</span>
            </>
        )
    }
}

const mapReduxStateToProps = (reduxState) => {
    return {
        game: reduxState.game,
    }
}

export default connect(mapReduxStateToProps)(Game);