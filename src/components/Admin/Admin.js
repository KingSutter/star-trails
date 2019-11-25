import React, {Component} from 'react';
import {connect} from 'react-redux';
import './Admin.css';

class Admin extends Component {
    state = {
        scenarioListShowing: true,
        scenarioAddInput: {
            prompt: '',
            option1: '',
            option2: '',
            good_outcome: '',
            bad_outcome: '',
            neutral_outcome: '',
            good_outcome_id: '',
            bad_outcome_id: '',
            neutral_outcome_id: '',
            non_neutral_outcome: '',
            non_neutral_outcome_id: '',
        },
        scenarioEditInput: {
            id: 0,
            prompt: '',
            option1: '',
            option2: '',
            good_outcome: '',
            bad_outcome: '',
            neutral_outcome: '',
            good_outcome_id: '',
            bad_outcome_id: '',
            neutral_outcome_id: '',
            non_neutral_outcome: '',
            non_neutral_outcome_id: '',
        },
        outcomeAddInput: {
            day: '',
            distance: '',
            food: '',
            money: '',
            phaser_energy: '',
            warp_coils: '',
            antimatter_flow_regulators: '',
            magnetic_constrictors: '',
            plasma_injectors: '',
            crew_lost: '',
        },
        outcomeEditInput: {
            day: '',
            distance: '',
            food: '',
            money: '',
            phaser_energy: '',
            warp_coils: '',
            antimatter_flow_regulators: '',
            magnetic_constrictors: '',
            plasma_injectors: '',
            crew_lost: '',
        },
    }

    // fetch all lists for admin to edit from the database
    componentWillMount(){
        this.props.dispatch({type: "GET_USERS"});
        this.props.dispatch({type: "GET_SCENARIOS"});
        this.props.dispatch({type: "GET_OUTCOMES"});
        //check if user is an admin
        if(this.props.userList.length === 0) {
            this.props.history.push('/')
        }
    }
    // will toggleScenarioList
    toggleList = () => {
        this.setState({
            scenarioListShowing: !this.state.scenarioListShowing,
        })
    }

    handleScenarioInput = (e) => {
        this.setState({
            scenarioAddInput: {
                ...this.state.scenarioAddInput,
                [e.target.placeholder]: e.target.value,
            }
        })
    }

    // adds input from scenario table footer to the database
    handleAddScenario = () => {        
        //check for empty input
        for (const key in this.state.scenarioAddInput) {
            if (this.state.scenarioAddInput[key] === ''){
                alert("All input fields must have text")
                return 0;
            }
        }
        // adds input to DB
        this.props.dispatch({
            type: "ADD_SCENARIO", 
            payload: {...this.state.scenarioAddInput, 
                option1_outcomes: `{${this.state.scenarioAddInput.good_outcome_id},${this.state.scenarioAddInput.bad_outcome_id}}`, 
                option2_outcomes: `{${this.state.scenarioAddInput.neutral_outcome_id}, ${this.state.scenarioAddInput.non_neutral_outcome_id}}`}})
        // effectively reset inputs to default values
        this.setState({
            scenarioAddInput: {
                prompt: '',
                option1: '',
                option2: '',
                good_outcome: '',
                bad_outcome: '',
                neutral_outcome: '',
                good_outcome_id: '',
                bad_outcome_id: '',
                neutral_outcome_id: '',
                non_neutral_outcome: '',
                non_neutral_outcome_id: '',
                option1_outcomes: `[ , ]`, 
                option2_outcomes: `[ , ]`,
            },
        })
    }

    // handle removes scenario clicked on
    handleRemoveScenario = (e) => {
        if (window.confirm(`Are you sure you wish to delete scenario ${e.target.name}?`)){
            this.props.dispatch({type: "DELETE_SCENARIO", payload: {id: Number(e.target.name)}})
        }
    }

    // user can edit entire row when called
    handleEditClick = (scenario, e) => {
        this.setState({
            scenarioEditInput: {
                prompt: scenario.prompt,
                option1: scenario.option1,
                option2: scenario.option2,
                good_outcome: scenario.good_outcome,
                good_outcome_id: scenario.good_outcome_id,
                bad_outcome: scenario.bad_outcome,
                bad_outcome_id: scenario.bad_outcome_id,
                neutral_outcome: scenario.neutral_outcome,
                neutral_outcome_id: scenario.neutral_outcome_id,
                non_neutral_outcome: scenario.non_neutral_outcome,
                non_neutral_outcome_id: scenario.non_neutral_outcome_id,
                id: e.target.name
            }
        })
    }
    
    handleEditScenarioInput = (e) => {
        this.setState({
            scenarioEditInput: {
                ...this.state.scenarioEditInput,
                [e.target.name]: e.target.value,
            }
        })
    }

    handleSubmitEdit = (e) => {
        this.props.dispatch({
            type: "EDIT_SCENARIO", 
            payload: {...this.state.scenarioEditInput, 
                option1_outcomes: `{${this.state.scenarioEditInput.good_outcome_id},${this.state.scenarioEditInput.bad_outcome_id}}`, 
                option2_outcomes: `{${this.state.scenarioEditInput.neutral_outcome_id}, ${this.state.scenarioEditInput.non_neutral_outcome_id}}`
            }
        });
        // effectively reset inputs to default values
        this.setState({
            scenarioEditInput: {
                id: 0,
                prompt: '',
                option1: '',
                option2: '',
                good_outcome: '',
                bad_outcome: '',
                neutral_outcome: '',
                good_outcome_id: '',
                bad_outcome_id: '',
                neutral_outcome_id: '',
                non_neutral_outcome: '',
                non_neutral_outcome_id: '',
                option1_outcomes: `[ , ]`, 
                option2_outcomes: `[ , ]`,
            },
        })
    }

    handleOutcomeInput = (e) => {
        this.setState({
            outcomeAddInput: {
                ...this.state.outcomeAddInput,
                [e.target.placeholder]: e.target.value,
            }
        })
    }

    // adds input from outcome table footer to the database
    handleAddOutcome = () => {        
        //check for empty input
        for (const key in this.state.outcomeAddInput) {
            if (this.state.outcomeAddInput[key] === ''){
                alert("All input fields must have text")
                return 0;
            }
        }
        // adds input to DB
        this.props.dispatch({
            type: "ADD_OUTCOME", 
            payload: this.state.outcomeAddInput});
        // effectively reset inputs to default values
        this.setState({
            outcomeAddInput: {
                day: '',
                distance: '',
                food: '',
                money: '',
                phaser_energy: '',
                warp_coils: '',
                antimatter_flow_regulators: '',
                magnetic_constrictors: '',
                plasma_injectors: '',
                crew_lost: '',
            },
        })
    }

    // handle removes outcome clicked on
    handleRemoveOutcome = (e) => {
        if (window.confirm(`Are you sure you wish to delete outcome ${e.target.name}?`)){
            this.props.dispatch({type: "DELETE_OUTCOME", payload: {id: Number(e.target.name)}})
        }
    }

    render() {
        return (
            <div className="adminView">
                {this.state.scenarioListShowing ? (
                    <>
                <button onClick={this.toggleList}>Show Users List</button><br/>
                    Scenarios: <br/><br/>
                    {/* displays all scenarios from the DB */}
                    <div id="scenarios-table">
                    <table>
                        <thead>
                            <tr>
                                <td>ID</td>
                                <td>Prompt</td>
                                <td>Option1</td>
                                <td>Option2</td>
                                <td>Good Outcome</td>
                                <td>Good Outcome ID</td>
                                <td>Bad Outcome</td>
                                <td>Bad Outcome ID</td>
                                <td>Neutral Outcome</td>
                                <td>Neutral Outcome ID</td>
                                <td>Non-neutral Outcome</td>
                                <td>Non-neutral Outcome ID</td>
                                <td>Outcome 1 IDs</td>
                                <td>Outcome 2 IDs</td>
                                <td></td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.scenarioList.map((scenario)=>(
                                <tr key={scenario.id}>
                                    {String(this.state.scenarioEditInput.id) !== String(scenario.id) ? (
                                    <>
                                    <td>{scenario.id}</td>
                                    <td>{scenario.prompt}</td>
                                    <td>{scenario.option1}</td>
                                    <td>{scenario.option2}</td>
                                    <td>{scenario.good_outcome}</td>
                                    <td>{scenario.good_outcome_id}</td>
                                    <td>{scenario.bad_outcome}</td>
                                    <td>{scenario.bad_outcome_id}</td>
                                    <td>{scenario.neutral_outcome}</td>
                                    <td>{scenario.neutral_outcome_id}</td>
                                    <td>{scenario.non_neutral_outcome}</td>
                                    <td>{scenario.non_neutral_outcome_id}</td>
                                    <td>[ {scenario.option1_outcomes[0]} , {scenario.option1_outcomes[1]} ]</td>
                                    <td>[ {scenario.option2_outcomes[0]} , {scenario.option2_outcomes[1]} ]</td>
                                    <td><button name={scenario.id} onClick={(e)=>this.handleEditClick(scenario, e)}>Edit</button></td>
                                    <td><button onClick={this.handleRemoveScenario} name={scenario.id}>Delete</button></td>
                                    </>
                                    ) : 
                                    <>
                                    <td></td>
                                    <td><textarea onChange={this.handleEditScenarioInput} value={this.state.scenarioEditInput.prompt} name="prompt" /></td>
                                    <td><textarea onChange={this.handleEditScenarioInput} value={this.state.scenarioEditInput.option1} name="option1" /></td>
                                    <td><textarea onChange={this.handleEditScenarioInput} value={this.state.scenarioEditInput.option2} name="option2" /></td>
                                    <td><textarea onChange={this.handleEditScenarioInput} value={this.state.scenarioEditInput.good_outcome} name="good_outcome" /></td>
                                    <td><input onChange={this.handleEditScenarioInput} type="number" min="1" value={this.state.scenarioEditInput.good_outcome_id} name="good_outcome_id" /></td>
                                    <td><textarea onChange={this.handleEditScenarioInput} value={this.state.scenarioEditInput.bad_outcome} name="bad_outcome" /></td>
                                    <td><input onChange={this.handleEditScenarioInput} type="number" min="1" value={this.state.scenarioEditInput.bad_outcome_id} name="bad_outcome_id" /></td>
                                    <td><textarea onChange={this.handleEditScenarioInput} value={this.state.scenarioEditInput.neutral_outcome} name="neutral_outcome" /></td>
                                    <td><input onChange={this.handleEditScenarioInput} type="number" min="1" value={this.state.scenarioEditInput.neutral_outcome_id} name="neutral_outcome_id" /></td>
                                    <td><textarea onChange={this.handleEditScenarioInput} value={this.state.scenarioEditInput.non_neutral_outcome} name="non_neutral_outcome" /></td>
                                    <td><input onChange={this.handleEditScenarioInput} type="number" min="1" value={this.state.scenarioEditInput.non_neutral_outcome_id} name="non_neutral_outcome_id" /></td>
                                    <td>[{this.state.scenarioEditInput.good_outcome_id}, {this.state.scenarioEditInput.bad_outcome_id}]</td>
                                    <td>[{this.state.scenarioEditInput.neutral_outcome_id}, {this.state.scenarioEditInput.non_neutral_outcome_id}]</td>
                                    <td><button onClick={this.handleSubmitEdit}>Submit</button></td>
                                    </>}
                                </tr>
                            ))}
                            
                        </tbody>
                        <tfoot>
                            <tr>
                                <td></td>
                                <td><input onChange={this.handleScenarioInput} placeholder="prompt" value={this.state.scenarioAddInput.prompt} form="handleAdd"/></td>
                                <td><input onChange={this.handleScenarioInput} placeholder="option1" value={this.state.scenarioAddInput.option1} form="handleAdd"/></td>
                                <td><input onChange={this.handleScenarioInput} placeholder="option2" value={this.state.scenarioAddInput.option2} form="handleAdd" /></td>
                                <td><input onChange={this.handleScenarioInput} placeholder="good_outcome" value={this.state.scenarioAddInput.good_outcome} form="handleAdd"/></td>
                                <td><input onChange={this.handleScenarioInput} placeholder="good_outcome_id" value={this.state.scenarioAddInput.good_outcome_id} form="handleAdd"/></td>
                                <td><input onChange={this.handleScenarioInput} placeholder="bad_outcome" value={this.state.scenarioAddInput.bad_outcome} form="handleAdd"/></td>
                                <td><input type="number" min="1" onChange={this.handleScenarioInput} placeholder="bad_outcome_id" value={this.state.scenarioAddInput.bad_outcome_id} form="handleAdd"/></td>
                                <td><input onChange={this.handleScenarioInput} placeholder="neutral_outcome" value={this.state.scenarioAddInput.neutral_outcome} form="handleAdd"/></td>
                                <td><input type="number" min="1" onChange={this.handleScenarioInput} placeholder="neutral_outcome_id" value={this.state.scenarioAddInput.neutral_outcome_id} form="handleAdd"/></td>
                                <td><input onChange={this.handleScenarioInput} placeholder="non_neutral_outcome" value={this.state.scenarioAddInput.non_neutral_outcome} form="handleAdd"/></td>
                                <td><input type="number" min="1" onChange={this.handleScenarioInput} placeholder="non_neutral_outcome_id" value={this.state.scenarioAddInput.non_neutral_outcome_id} form="handleAdd"/></td>
                                <td>[{this.state.scenarioAddInput.good_outcome_id}, {this.state.scenarioAddInput.bad_outcome_id}]</td>
                                <td>[{this.state.scenarioAddInput.neutral_outcome_id}, {this.state.scenarioAddInput.non_neutral_outcome_id}]</td>
                                <td><button type="submit" form="handleAdd">Add</button></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <br/>
                <form onSubmit={this.handleAddScenario} id="handleAdd"></form>
                {/*  displays all of the outcome types from the DB */}
                <div id="outcome-types">
                    Outcomes: <br/><br/>
                    <table>
                        <thead>
                            <tr>
                                <td>ID</td>
                                <td>Day</td>
                                <td>Distance</td>
                                <td>Food</td>
                                <td>Money</td>
                                <td>Phaser Energy</td>
                                <td>Warp Coils</td>
                                <td>Antimatter Flow Regulators</td>
                                <td>Magnetic Constrictors</td>
                                <td>Plasma Injectors</td>
                                <td>Crew Lost</td>
                                <td></td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.outcomeList.map((outcome)=>(
                                <tr key={outcome.id}>
                                    <td>{outcome.id}</td>
                                    <td>{outcome.day}</td>
                                    <td>{outcome.distance}</td>
                                    <td>{outcome.food}</td>
                                    <td>{outcome.money}</td>
                                    <td>{outcome.phaser_energy}</td>
                                    <td>{outcome.warp_coils}</td>
                                    <td>{outcome.antimatter_flow_regulators}</td>
                                    <td>{outcome.magnetic_constrictors}</td>
                                    <td>{outcome.plasma_injectors}</td>
                                    <td>{outcome.crew_lost}</td>
                                    <td><button id={outcome.id}>Edit</button></td>
                                    <td><button id={outcome.id}>Delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td></td>
                                <td><input placeholder="day"/></td>
                                <td><input placeholder="distance"/></td>
                                <td><input placeholder="food"/></td>
                                <td><input placeholder="money"/></td>
                                <td><input placeholder="phaser_energy"/></td>
                                <td><input placeholder="warp_coils"/></td>
                                <td><input placeholder="antimatter_flow_regulators"/></td>
                                <td><input placeholder="magnetic_constrictors"/></td>
                                <td><input placeholder="plasma_injectors"/></td>
                                <td><input placeholder="crew lost" size="10"/></td>
                                <td><button>Add</button></td>
                            </tr>
                        </tfoot>
                    </table>
                </div></>) : (
                    <div id="usersTable">
                        <button onClick={this.toggleList}>Show Scenarios</button>
                        <br/>Users:<br/><br/>
                        <table>
                            <thead>
                                <tr>
                                    <td>ID</td>
                                    <td>Username</td>
                                    <td>Save ID</td>
                                    <td>Admin</td>
                                    <td/>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.userList.map((user)=>(
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>{String(user.save_id)}</td>
                                        <td>{String(user.admin)}</td>
                                        <td>{!user.admin? <button>Delete</button>:<></>}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
        <span>{JSON.stringify(this.state.scenarioAddInput,null,2)}</span>
            </div>
        )
    }
}

const mapReduxStateToProps = (reduxState) => {
    return {
        userList: reduxState.admin.userList,
        scenarioList: reduxState.admin.scenarioList,
        outcomeList: reduxState.admin.outcomeList
    };
}

export default connect(mapReduxStateToProps)(Admin);