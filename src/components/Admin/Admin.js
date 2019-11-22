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
        editingID: 0,
    }

    // fetch all lists for admin to edit from DB
    componentWillMount(){
        this.props.dispatch({type: "GET_USERS"});
        this.props.dispatch({type: "GET_SCENARIOS"});
        this.props.dispatch({type: "GET_OUTCOMES"});
        //check if user is an admin
        if(this.props.userList.length == 0) {
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

    handleAddScenario = () => {
        console.log('handle scenario called');
        
        //check for empty input
        for (const key in this.state.scenarioAddInput) {
            if (this.state.scenarioAddInput[key] === ''){
                alert("All input fields must have text")
                return 0;
            }
        }
        // adds input to DB
        this.props.dispatch({type: "ADD_SCENARIO", payload: this.state.scenarioAddInput})
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
            }
        })
    }

    // user can edit entire row when called
    handleEditClick = (e) => {
        this.setState({
            editingID: e.target.id,
        })
    }  
    render() {
        return (
            <div class="adminView">
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
                                    {String(this.state.editingID) !== String(scenario.id) ? (
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
                                    <td>{scenario.option1_outcomes}</td>
                                    <td>{scenario.option2_outcomes}</td>
                                    <td><button id={scenario.id} onClick={this.handleEditClick}>Edit</button></td>
                                    <td><button id={scenario.id}>Delete</button></td>
                                    </>
                                    ) : 
                                    <>
                                    <td></td>
                                    <td><input placeholder="prompt" value={scenario.prompt} /></td>
                                    <td><input placeholder="option1" value={scenario.option1} /></td>
                                    <td><input placeholder="option2" value={scenario.option2} /></td>
                                    <td><input placeholder="good_outcome" value={scenario.good_outcome} /></td>
                                    <td><input placeholder="bad_outcome" value={scenario.bad_outcome} /></td>
                                    <td><input placeholder="neutral_outcome" value={scenario.neutral_outcome} /></td>
                                    <td><input type="number" min="1" placeholder="good_outcome_type_id" value={scenario.good_outcome_type_id} /></td>
                                    <td><input type="number" placeholder="bad_outcome_type_id" value={scenario.bad_outcome_type_id} /></td>
                                    <td><input type="number"placeholder="neutral_outcome_type_id" value={scenario.neutral_outcome_type_id} /></td>
                                    <td><button onClick={this.handleEditClick}>Submit</button></td>
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
                                <td><input onChange={this.handleScenarioInput} placeholder="bad_outcome" value={this.state.scenarioAddInput.bad_outcome} form="handleAdd"/></td>
                                <td><input onChange={this.handleScenarioInput} placeholder="neutral_outcome" value={this.state.scenarioAddInput.neutral_outcome} form="handleAdd"/></td>
                                <td><input type="number" min="1" onChange={this.handleScenarioInput} placeholder="good_outcome_type_id" value={this.state.scenarioAddInput.good_outcome_type_id} form="handleAdd"/></td>
                                <td><input type="number" min="1" onChange={this.handleScenarioInput} placeholder="bad_outcome_type_id" value={this.state.scenarioAddInput.bad_outcome_type_id} form="handleAdd"/></td>
                                <td><input type="number" min="1" onChange={this.handleScenarioInput} placeholder="neutral_outcome_type_id" value={this.state.scenarioAddInput.neutral_outcome_type_id} form="handleAdd"/></td>
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
                                <td>Fuel</td>
                                <td>Resource1</td>
                                <td>Resource2</td>
                                <td>Resource3</td>
                                <td>Resource4</td>
                                <td>Resource5</td>
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
                                    <td>{outcome.fuel}</td>
                                    <td>{outcome.resource1}</td>
                                    <td>{outcome.resource2}</td>
                                    <td>{outcome.resource3}</td>
                                    <td>{outcome.resource4}</td>
                                    <td>{outcome.resource5}</td>
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
                                <td><input placeholder="fuel"/></td>
                                <td><input placeholder="resource 1"/></td>
                                <td><input placeholder="resource 2"/></td>
                                <td><input placeholder="resource 3"/></td>
                                <td><input placeholder="resource 4"/></td>
                                <td><input placeholder="resource 5"/></td>
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
        <span>{JSON.stringify(this.props,null,2)}</span>
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
