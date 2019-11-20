import React,{Component} from 'react';
import {connect} from 'react-redux';
import './Game.css';

// This is the main view the user will be at for the majority of the game
// Here, the user can manage how fast they're going, the food rations, 
// view the supply manifest, view crew status, view overall game progress,
// start a new day, and quit the game.

class Game extends Component{
    componentDidMount(){
        this.props.dispatch({type: "GET_SAVE"})
    }
    render(){
        return(
            <>
            <div id="shipImage">
                <img alt="ship" />
            </div>
            <br/>
            <div id="distanceTravelledGraph">
            
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
                            <td>{this.props.game.saveData.food}</td>
                            <td>{this.props.game.saveData.money}</td>
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