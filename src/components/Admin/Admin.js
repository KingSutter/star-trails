import React, {Component} from 'react';
import {connect} from 'react-redux';

class Admin extends Component {
    state = {
        userListShowing: false,
        scenarioListShowing: false,
    }

    // fetch all 
    componentDidMount(){
        this.props.dispatch({type: "GET_USERS"})
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
