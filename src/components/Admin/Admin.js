import React, {Component} from 'react';
import {connect} from 'react-redux';
import './Admin.css';

class Admin extends Component {
    state = {
        userListShowing: false,
        scenarioListShowing: false,
    }

    // fetch all 
    componentDidMount(){
        this.props.dispatch({type: "GET_USERS"});
        this.props.dispatch({type: "GET_SCENARIOS"});
        this.props.dispatch({type: "GET_OUTCOMES"});
    }

    toggleUserList = () => {
        this.setState({
            userListShowing: !this.state.userListShowing,
        })
    }
    // will toggleScenarioList
    toggleScenarioList = () => {
        this.setState({
            scenarioListShowing: !this.state.scenarioListShowing,
        })
    }
    getAllLists = () => {
        return 0;
    }
    render() {
        return (
            <div>
                <button onClick={this.toggleUserList}>Users List</button>
                <button onClick={this.toggleScenarioList} >Scenarios List</button>
                <div id="scenarios-table">
                    Scenarios: <br/><br/>
                    <table>
                        <thead>
                            <tr>
                                <td>ID</td>
                                <td>Prompt</td>
                                <td>Option1</td>
                                <td>Option2</td>
                                <td>Good Outcome</td>
                                <td>Bad Outcome</td>
                                <td>Neutral Outcome</td>
                                <td>Good Outcome ID</td>
                                <td>Bad Outcome ID</td>
                                <td>Neutral Outcome ID</td>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.scenarioList.map((scenario)=>(
                                <tr>
                                    <td>{scenario.id}</td>
                                    <td>{scenario.prompt}</td>
                                    <td>{scenario.option1}</td>
                                    <td>{scenario.option2}</td>
                                    <td>{scenario.good_outcome}</td>
                                    <td>{scenario.bad_outcome}</td>
                                    <td>{scenario.neutral_outcome}</td>
                                    <td>{scenario.good_outcome_type_id}</td>
                                    <td>{scenario.bad_outcome_type_id}</td>
                                    <td>{scenario.neutral_outcome_type_id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <br/>
                <div id="outcome-types">
                    Outcomes by ID: <br/><br/>
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
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.outcomeList.map((outcome)=>(
                                <tr>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
        {/* <span>{JSON.stringify(this.props,null,2)}</span> */}
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
