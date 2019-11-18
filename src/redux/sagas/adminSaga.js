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
    console.log('admin user list get request failed', error);
  }
}

function* getOutcomes() {
  try {
    const response = yield axios.get('/api/user/outcomes');
    yield put({ type: 'SET_OUTCOME_LIST', payload: response.data });
  } catch (error) {
    console.log('admin user list get request failed', error);
  }
}

function* adminSaga() {
  yield takeLatest('GET_USERS', getUsers);
  yield takeLatest('GET_SCENARIOS', getScenarios);
  yield takeLatest('GET_OUTCOMES', getOutcomes);
}

export default adminSaga;
