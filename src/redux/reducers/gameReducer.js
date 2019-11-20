import { combineReducers } from 'redux';

// save data will be stored here
const saveData = (state = {}, action) => {
    if (action.type === 'SET_SAVE_DATA'){
        return action.payload;
    }
    else return state;
}

// save data will be stored here
const scenarios = (state = [], action) => {
    if (action.type === 'SET_SCENARIOS'){
        return action.payload;
    }
    else return state;
}

// user will be on the redux state at:
// state.game
export default combineReducers({
    saveData,
    scenarios,
  });