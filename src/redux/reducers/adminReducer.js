import { combineReducers } from 'redux';

const userList = (state = [], action) => {
    if (action.type === 'SET_USER_LIST'){
        return action.payload;
    }
    else return state;
}

const scenarioList = (state = [], action) => {
    if (action.type === 'SET_SCENARIO_LIST'){
        return action.payload;
    }
    else return state;
}

export default combineReducers({
    userList,
    scenarioList,
  });