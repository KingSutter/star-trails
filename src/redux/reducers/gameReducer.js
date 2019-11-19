import { combineReducers } from 'redux';

// save data will be stored here
const saveData = (state = {}, action) => {
    if (action.type === 'SET_SAVE_DATA'){
        return action.payload;
    }
    else return state;
}


export default combineReducers({
    saveData,
  });