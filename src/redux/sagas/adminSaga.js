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
    console.log('admin scenarios list get request failed', error);
  }
}

function* getOutcomes() {
  try {
    const response = yield axios.get('/api/user/outcomes');
    yield put({ type: 'SET_OUTCOME_LIST', payload: response.data });
  } catch (error) {
    console.log('admin outcomes list get request failed', error);
  }
}

function* addScenario(action) {
  try {
    console.log(action.payload);
    
    yield axios.post('/api/user/scenario', action.payload);
    yield put({ type: 'GET_SCENARIOS'});
  } catch (error) {
    console.log('admin add scenario put failed', error);
  }
}

function* adminSaga() {
  yield takeLatest('GET_USERS', getUsers);
  yield takeLatest('GET_SCENARIOS', getScenarios);
  yield takeLatest('GET_OUTCOMES', getOutcomes);
  yield takeLatest('ADD_SCENARIO', addScenario);
}

export default adminSaga;
