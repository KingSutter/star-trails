import React,{Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom'
import './Game.css';
import shipflying from './shipflying2.gif'

// import components
import HuntingGame from './HuntingGame/HuntingGame'

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
        hunting: false,
        class_M_planet: false,
    }

    // get all relevant data from the DB for use throughout the entirety of the game
    componentDidMount(){
        this.props.dispatch({type: "GET_SAVE"});
        this.props.dispatch({type: "GET_SCENARIOS"});
        this.props.dispatch({type: "GET_OUTCOMES"});
    }

    // will handle all logic for whether an event happens and send updated data to save
    handleNewDay = () => {
        this.checkWinLoss();
        // if the rng function returns true, run a random scenario
        const scenarioTrigger = this.randomInt(1,8);    // if the random integer (1-8) returned is 1, an scenario will occur
        if (scenarioTrigger === 8) {  // 1 in 8 chance you will run into a class M planet to hunt
            this.setState({scenarioTriggered: true, class_M_planet: true});
        }
        else if (scenarioTrigger === 1){
            let allScenarioIds = [];
            // get all scenarioIDs (DB may not have linear IDs)
            this.props.game.scenarios.forEach(scenario => {
                allScenarioIds.push(scenario.id);
            });
            // get a random id from list of all random ids
            const id = allScenarioIds[Math.floor(Math.random() * (allScenarioIds.length-1))]; 
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
                distance: this.props.game.saveData.distance + this.DistanceModifier(), // travel +distance based on modifier
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
                ...this.FoodModifier(),
            }
            this.updateSave(newSave);
            this.calculateCrewHealth();
        }
    }

    // logic behind when option button is pressed.
    // this will alter the save state to whatever the outcome result will be
    handleOption = (option) => {
        const result = this.calculateOutcome();
        let outcomeID = null;
        if (option === 1){ outcomeID = this.state.scenario.option1_outcomes[result]; } // if option1 was pressed...
        else{ outcomeID = this.state.scenario.option2_outcomes[result]; } // if option 2 was pressed...
        // get outcome by id (consider using dispatch for this, but be concerned about whether it is synchronous)
        let outcome = {}
        this.props.game.outcomes.forEach(OUTCOME => {
            if(OUTCOME.id === outcomeID){outcome = OUTCOME}
        });
        // get outcome text
        let text = '';
        if(option === 1){ text = [this.state.scenario.good_outcome, this.state.scenario.bad_outcome][result]} // if option1 was pressed...
        else{ text = [this.state.scenario.neutral_outcome, this.state.scenario.non_neutral_outcome][result]} // if option2 was pressed...
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
        const num = this.randomInt(0,100);
        console.log("random num", num);
        console.log("crew health rating", (this.calculateCrewHealth() * 100) + 15)
        console.log("num < rating", (num < (this.calculateCrewHealth() * 100) + 15));
        // currently the odds are 25% min (only one crew member alive) and 65% max (everyone is healthy) 
        return (num < (this.calculateCrewHealth() * 100) + 15) ? 0 : 1;
    }

    // gets random integer from inlcusive min to inclusive max
    randomInt = (min, max) => {
        return Math.floor(Math.random() * (max + 1 - min) + min);
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
            distance: this.props.game.saveData.distance + outcome.distance + this.DistanceModifier(),
            food: this.checkResource(this.props.game.saveData.food, outcome.food),
            money: this.checkResource(this.props.game.saveData.money, outcome.money),
            phaser_energy: this.checkResource(this.props.game.saveData.phaser_energy, outcome.phaser_energy),
            warp_coils: this.checkResource(this.props.game.saveData.warp_coils, outcome.warp_coils),
            antimatter_flow_regulators: this.checkResource(this.props.game.saveData.antimatter_flow_regulators, outcome.antimatter_flow_regulators),
            magnetic_constrictors: this.checkResource(this.props.game.saveData.magnetic_constrictors, outcome.magnetic_constrictors),
            plasma_injectors: this.checkResource(this.props.game.saveData.plasma_injectors, outcome.plasma_injectors),
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

    // checks if the user has won or lost the game
    checkWinLoss = () => {
        if (this.props.game.saveData.distance >= 149){
            this.setState({endGame: "win"});
        }
        else if (
            this.props.game.saveData.captain_status === "dead" &&
            this.props.game.saveData.medic_status === "dead" &&
            this.props.game.saveData.engineer_status === "dead" &&
            this.props.game.saveData.helm_status === "dead" &&
            this.props.game.saveData.tactical_status === "dead"
        ){this.setState({endGame: "lose"});}
    }

    // returns user to the main menu
    handleReturnToMenu = () => {
        this.props.history.push('/home');
    }

    // calculates crew's overall health rating
    calculateCrewHealth = () => {
        let healthRating = 15;
        const crewStatus = {
            captain: this.props.game.saveData.captain_status,
            medic: this.props.game.saveData.medic_status,
            engineer: this.props.game.saveData.engineer_status,
            helm: this.props.game.saveData.helm_status,
            tactical: this.props.game.saveData.tactical_status,
        }
        for (const key in crewStatus) {
            // if (crewStatus[key] === "healthy") rating = 2;
            if (crewStatus[key] === "tired") healthRating-=1;
            else if (crewStatus[key] === "sick" || crewStatus[key]==="starving") healthRating-=2;
            else if (crewStatus[key] === "dead") healthRating-=3;
        }
        return (healthRating/30); // this gets a ratio from 1 - 15 and scales the ratio to less than 0.5
    }

    // adjusts the crew's hunger status based on amount of food
    FoodModifier = () => {
        if (this.props.game.saveData.food === 0){
            let crew = [["captain_status", this.props.game.saveData.captain_status], ["medic_status", this.props.game.saveData.medic_status], ["engineer_status", this.props.game.saveData.engineer_status], ["helm_status", this.props.game.saveData.helm_status], ["tactical_status", this.props.game.saveData.tactical_status]]
            if (this.randomInt(0,10) < 9){ // 80% chance a random crew member becomes hungry
                let changedCrew = {}
                let indexToChange = this.randomInt(0,4);
                // if that person is not already hungry, make it so
                if (crew[indexToChange][1] !== "starving" && crew[indexToChange][1] !== "dead"){
                    changedCrew[crew[indexToChange][0]] = "starving";
                }
                return changedCrew;
            }
            else return crew;
        }
    }

    // adjusts the ship's speed based on spare materials
    DistanceModifier = () => {
        let modifier = 1
        if (this.props.game.saveData.warp_coils === 0) modifier -= .75;
        if (this.props.game.saveData.antimatter_flow_regulators === 0) modifier -= .1;
        if (this.props.game.saveData.magnetic_constrictors === 0) modifier -= .1;
        if (this.props.game.saveData.plasma_injectors === 0) modifier -= .1
        if(modifier < 0 ) modifier = 0;
        
        return modifier;
    }

    toggleHunting = () => {
        if (this.state.hunting){
            this.setState({
                hunting: false, 
                scenarioTriggered: false, 
                class_M_planet: false,
            });
        }
        else {
            this.setState({
                hunting: true, 
                scenarioTriggered: false, 
                class_M_planet: false
            });
        }
    }

    render(){
        return(
            <>
            {!this.state.endGame ? (
            <div className="gameView">
            {!this.state.hunting ? (
            <div id="mainGameView"> 
            {/* this is what displays when a scenario is NOT ongoing */}
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
                {!this.state.scenarioTriggered ? (
                    <div className="buttons">
                        <button onClick={this.handleNewDay} id="newDayButton">New day</button>
                    </div> 
                ) : (
                    <div id="scenarioMainView">
                        {!this.state.outcomeTriggered ? (
                            <>
                            {!this.state.class_M_planet ? (
                                <div id="scenarioView">
                                    <h3>{this.state.scenario.prompt}</h3>
                                    <p id="optionButtons">
                                    <button onClick={()=>{this.handleOption(1)}} id="optionButton">{this.state.scenario.option1}</button><br/>
                                    <button onClick={()=>{this.handleOption(2)}} id="optionButton">{this.state.scenario.option2}</button>
                                    </p>
                                </div>
                            ) : (
                                <div id="huntingScenarioView">
                                    <h3>You find a class M planet with animals indigenous to it. Would you like to stop to go hunting?</h3>
                                    <p id="optionButtons">
                                    <button onClick={this.toggleHunting} id="optionButton">Yes</button><br/>
                                    <button onClick={()=>{this.setState({scenarioTriggered: false, class_M_planet: false})}} id="optionButton">No</button>
                                    </p>
                                </div>
                            )}
                            </>
                        ) : (
                            <div id="outcomeView">
                                <h3>{this.state.outcomeText}</h3>
                                <button onClick={this.handleContinue}>Continue</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            ): (
            <div id="huntingView">
                <HuntingGame toggleHunting={this.toggleHunting} food={this.props.game.saveData.food} phaser_energy={this.props.game.saveData.phaser_energy}/>
            </div> )}
        </div>
        ):(
            <div id="gameResultView">
                {this.state.endGame==="win"? (
                    <div id="winView">
                        <p>You won!</p>
                        <button onClick={this.handleReturnToMenu}>Return to main menu</button>
                    </div>
                ):(
                    <div id="lossView">
                        <p>You lost</p>
                        <button onClick={this.handleReturnToMenu}>Return to main menu</button>
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

export default withRouter(connect(mapReduxStateToProps)(Game));

// with router is currently only used for pushing back to home
// after the game ends.