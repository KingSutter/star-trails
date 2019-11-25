import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* getUsers() {
  try {
    const response = yield axios.get('/api/user/users');
    yield put({ type: 'SET_USER_LIST', payload: response.data });
  } catch (error) {
    console.log('admin user list get request failed', error);
  }
}

function* getScenarios() {
  try {
    const response = yield axios.get('/api/user/scenarios');
    yield put({ type: 'SET_SCENARIO_LIST', payload: response.data });
  } catch (error) {
    console.log('scenarios list get request failed', error);
  }
}

function* getOutcomes() {
  try {
    const response = yield axios.get('/api/user/outcomes');
    yield put({ type: 'SET_OUTCOME_LIST', payload: response.data });
  } catch (error) {
    console.log('outcomes list get request failed', error);
  }
}

function* addScenario(action) {
  try {
    yield axios.post('/api/user/scenario', action.payload);
    yield put({ type: 'GET_SCENARIOS'});
  } catch (error) {
    console.log('admin add scenario put failed', error);
  }
}

function* deleteScenario(action){
  try {
    yield axios.delete(`/api/user/scenario/${action.payload.id}`);
    yield put({ type: 'GET_SCENARIOS'});
  } catch (error) {
    console.log('admin delete scenario failed', error);
  }
}


function* editScenario(action){
  try {   
    yield axios.put(`/api/user/scenario`, action.payload);
    yield put({ type: 'GET_SCENARIOS'});
  } catch (error) {
    console.log('admin edit scenario failed', error);
  }
}

function* addOutcome(action) {
  try {    
    yield axios.post('/api/user/outcome', action.payload);
    yield put({ type: 'GET_OUTCOMES'});
  } catch (error) {
    console.log('admin add outcome put failed', error);
  }
}

function* deleteOutcome(action){
  try {
    yield axios.delete(`/api/user/outcome/${action.payload.id}`);
    yield put({ type: 'GET_OUTCOMES'});
  } catch (error) {
    console.log('admin delete outcome failed', error);
  }
}


function* editOutcome(action){
  try {
    yield axios.put(`/api/user/outcome`, action.payload);
    yield put({ type: 'GET_OUTCOMES'});
  } catch (error) {
    console.log('admin edit outcome failed', error);
  }
}

function* deleteUser(action){
  try {
    yield axios.delete(`/api/user/user/${action.payload.id}`);
    yield put({ type: 'GET_USERS'});
  } catch (error) {
    console.log('admin delete user failed', error);
  }
}

function* adminSaga() {
  yield takeLatest('GET_USERS', getUsers);
  yield takeLatest('GET_SCENARIOS', getScenarios);
  yield takeLatest('GET_OUTCOMES', getOutcomes);
  yield takeLatest('ADD_SCENARIO', addScenario);
  yield takeLatest('EDIT_SCENARIO', editScenario);
  yield takeLatest('DELETE_SCENARIO', deleteScenario);
  yield takeLatest('ADD_OUTCOME', addOutcome);
  yield takeLatest('EDIT_OUTCOME', editOutcome);
  yield takeLatest('DELETE_OUTCOME', deleteOutcome);
  yield takeLatest('DELETE_USER', deleteUser);

}

export default adminSaga;
