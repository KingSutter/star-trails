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
    state = {
        scenarioTriggered: false,
        scenario: null,
        outcomeTriggered: false,
        outcomeText: '',
        outcomeChanges: {},
        endGame: false,
    }

    // get all relevant data from the DB for use throughout the entirety of the game
    componentDidMount(){
        this.props.dispatch({type: "GET_SAVE"});
        this.props.dispatch({type: "GET_SCENARIOS"});
        this.props.dispatch({type: "GET_OUTCOMES"});
    }

    // will handle all logic for whether an event happens and send updated data to save
    handleNewDay = () => {
        // if the rng function returns true, run a random scenario
        const scenarioTrigger = this.randomInt(1,7)===1;    // if the random integer (1-7) returned is 1, an scenario will occur
        if (scenarioTrigger){     // do if we're in a scenario
            let allScenarioIds = [];
            // get all scenarioIDs (DB may not have linear IDs)
            this.props.game.scenarios.forEach(scenario => {
                allScenarioIds.push(scenario.id);
            });
            // get a random id from list of all random ids
            const id = allScenarioIds[Math.floor(Math.random() * allScenarioIds.length)]-1; 
            // refresh state with new scenario information
            this.setState({
                scenarioTriggered: scenarioTrigger,
                scenario: this.props.game.scenarios[id],
            })
        }
        else{
            // default new day
            const newSave = {
                day: this.props.game.saveData.day + 1, // next day
                distance: this.props.game.saveData.distance + 1, // travel +1 lightyear
                food: this.checkResource(this.props.game.saveData.food, -10), // eat 10 food (-10)
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
            this.checkWinLoss();
        }
    }

    // logic behind when option 1 button is pressed.
    // this will alter the save state to whatever the outcome result will be
    handleOption1 = () => {
        console.log("doing option1");
        const result = this.calculateOutcome();
        const outcomeID = this.state.scenario.option1_outcomes[result]; 
        // get outcome by id (consider using dispatch for this, but be concerned about whether it is synchronous)
        let outcome = {}
        this.props.game.outcomes.forEach(OUTCOME => {
            if(OUTCOME.id == outcomeID){outcome = OUTCOME}
        });
        // get outcome text
        const text = [this.state.scenario.good_outcome, this.state.scenario.bad_outcome][result]
        // update save based on outcome
        this.updateSave(this.addSaves(outcome))
        // set state for use by outcome view
        this.setState({outcomeTriggered: true, outcomeText: text, outcomeChanges: outcome})
        this.checkWinLoss();
    }
    
    // logic behind when option 2 button is pressed.
    // this will alter the save state to whatever the outcome result will be
    handleOption2 = () => {
        console.log("doing option2");
        const result = this.calculateOutcome();
        const outcomeID = this.state.scenario.option2_outcomes[result]; 
        // get outcome by id (consider using dispatch for this, but be concerned about whether it is synchronous)
        let outcome = {}
        this.props.game.outcomes.forEach(OUTCOME => {
            if(OUTCOME.id == outcomeID){outcome = OUTCOME}
        });
        // get outcome text
        const text = [this.state.scenario.neutral_outcome, this.state.scenario.non_neutral_outcome][result]
        // update save based on outcome
        this.updateSave(this.addSaves(outcome))
        // set state for use by outcome view
        this.setState({outcomeTriggered: true, outcomeText: text, outcomeChanges: outcome})
        this.checkWinLoss();
    }

    handleContinue = () => {
        this.setState({scenarioTriggered: false, outcomeTriggered: false});
    }

    // send newSave to DB and change respective values
    updateSave = (saveData) => {
        this.props.dispatch({type: "UPDATE_SAVE", payload: saveData})
    }

    // calculate whether game will use outcome index 0 or 1 (0 being better, 1 being worse)
    calculateOutcome = () => {
        // currently the outcome is just a 50/50 chance.
        // will implement factors that will sway the outcome
        return this.randomInt(0,1) 
    }

    // gets random integer from inlcusive min to inclusive max
    randomInt = (min, max) => {
        return Math.floor(Math.random() * (max + 1 - min) + min)
    }

    // returns new save data per a scenario outcome dataset
    addSaves = (outcome) => {
        // if a crew member(s) was lost, determine who
        let crew = [["captain_status", this.props.game.saveData.captain_status], ["medic_status", this.props.game.saveData.medic_status], ["engineer_status", this.props.game.saveData.engineer_status], ["helm_status", this.props.game.saveData.helm_status], ["tactical_status", this.props.game.saveData.tactical_status]]
        let changedCrew = {}
        for (let index = 0; index < outcome.crew_lost; index++) {
            let indexToKill = this.randomInt(0,4);
            // if that person is not already dead, kill them
            if (crew[indexToKill][1] !== "dead"){
                changedCrew[crew[indexToKill][0]] = "dead";

                // consider implementing the name of the person who died
            }else{index-=1;}
        }
        return {
            day: this.props.game.saveData.day + outcome.day,
            distance: this.props.game.saveData.distance + outcome.distance,
            food: this.checkResource(this.props.game.saveData.food, outcome.food),
            money: this.checkResource(this.props.game.saveData.money + outcome.money),
            phaser_energy: this.checkResource(this.props.game.saveData.phaser_energy + outcome.phaser_energy),
            warp_coils: this.checkResource(this.props.game.saveData.warp_coils + outcome.warp_coils),
            antimatter_flow_regulators: this.checkResource(this.props.game.saveData.antimatter_flow_regulators + outcome.antimatter_flow_regulators),
            magnetic_constrictors: this.checkResource(this.props.game.saveData.magnetic_constrictors + outcome.magnetic_constrictors),
            plasma_injectors: this.checkResource(this.props.game.saveData.plasma_injectors + outcome.plasma_injectors),
            captain_status: this.props.game.saveData.captain_status,
            medic_status: this.props.game.saveData.medic_status,
            engineer_status: this.props.game.saveData.engineer_status,
            helm_status: this.props.game.saveData.helm_status,
            tactical_status: this.props.game.saveData.tactical_status,
            ...changedCrew,
        } 
    }

    // checks if resource change will go negative, if so, return 0, else return normal change
    checkResource = (current, change) => {
        if ((current + change) < 0) return 0;
        else return current + change;
    }

    checkWinLoss = () => {
        if (this.props.game.saveData.distance >= 149){
            this.setState({endGame: "win"})
        }
        else if (
            this.props.game.saveData.captain_status === "dead" &&
            this.props.game.saveData.medic_status === "dead" &&
            this.props.game.saveData.engineer_status === "dead" &&
            this.props.game.saveData.helm_status === "dead" &&
            this.props.game.saveData.tactical_status === "dead"
        ){this.setState({endGame: "lose"})}
    }

    render(){
        return(
            <>
            {!this.state.endGame ? (
            <div class="gameView">
            {/* this is what displays when a scenario is NOT ongoing */}
            {!this.state.scenarioTriggered ? (
                <div id="mainGameView">
                    <div id="shipImage">
                        {/* other link to try https://i.imgur.com/U8iGpMC.gif */}
                        {/* http://i.imgur.com/1iuK86O.gif */}
                        {/* dodging bullets http://www.elginpk.com/worsley1415_1/woolley/spaceship2.gif */}
                        {/* chill https://media.giphy.com/media/lUlcicyv8d6G4/giphy.gif */}
                        {/* https://www.google.com/search?biw=960&bih=945&tbm=isch&sxsrf=ACYBGNSqH4MGVs0i7D5YaA8bCAq_8aAl4g%3A1574215455571&sa=1&ei=H5_UXZ7EIszSsAXKwpZI&q=pixel+enterprise+gif&oq=pixel+enterprise+gif&gs_l=img.3...5534.6294..6395...1.0..0.65.300.5......0....1..gws-wiz-img.......0i8i30j0i24.EYlqo412fhU&ved=0ahUKEwjez53I2fflAhVMKawKHUqhBQkQ4dUDCAc&uact=5#imgrc=1XEjFgTvropdAM: */}
                        <img src={shipflying} alt="ship" id="shipGIF" />
                    </div>
                    <br/>
                    <div id="date">
                        Day: {this.props.game.saveData.day}<br/>
                        Distance Travelled: {this.props.game.saveData.distance} light years / 150 light years
                    </div>
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
                                    <td>Title</td>
                                    <td>Status</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="title">Captain {this.props.game.saveData.captain}</td>
                                    <td>{this.props.game.saveData.captain_status}</td>
                                </tr>
                                <tr>
                                    <td className="title">Chief Medic {this.props.game.saveData.medic}</td>
                                    <td>{this.props.game.saveData.medic_status}</td>
                                </tr>
                                <tr>
                                    <td className="title">Chief Engineer {this.props.game.saveData.engineer}</td>
                                    <td>{this.props.game.saveData.engineer_status}</td>
                                </tr>
                                <tr>
                                    <td className="title">Helmsman {this.props.game.saveData.helm}</td>
                                    <td>{this.props.game.saveData.helm_status}</td>
                                </tr>
                                <tr>
                                    <td className="title">Tactical Officer {this.props.game.saveData.tactical}</td>
                                    <td>{this.props.game.saveData.tactical_status}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <br/>
                    <footer id="buttons">
                        <button onClick={this.handleNewDay}>New day</button>
                    </footer>
                </div>
            ) : (
                <>
                {!this.state.outcomeTriggered ? (
                    <div id="scenarioView">
                        <h3>{this.state.scenario.prompt}</h3>
                        <button onClick={this.handleOption1} id="optionButton">{this.state.scenario.option1}</button><br/>
                        <button onClick={this.handleOption2} id="optionButton">{this.state.scenario.option2}</button>
                    </div>
                ) : (
                    <div id="outcomeView">
                        <h3>{this.state.outcomeText}</h3>
                        <p>{JSON.stringify(this.state.outcomeChanges,null,2)}</p>
                        <button onClick={this.handleContinue}>Continue</button>
                    </div>
                )}
                </>
            )}
            {/* <span>{JSON.stringify(this.state.scenarios,null,2)}</span> */}
            </div>
            ):(
                <div id="gameResultView">
                    {this.state.endGame==="win"? (
                        <div id="winView">
                            You won!
                        </div>
                    ):(
                        <div id="lossView">
                            You lost.
                        </div>
                    )}
                </div>
            )}
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