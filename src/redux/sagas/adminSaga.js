import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* getUsers() {
  try {
    const response = yield axios.get('/api/user/users');
    yield put({ type: 'SET_USER_LIST', payload: response.data });
  } catch (error) {
    console.log('admin user list get request failed', error);
  }
}

function* adminSaga() {
  yield takeLatest('GET_USERS', getUsers);
//   yield takeLastest('GET_SCENARIOS', getScenarios)
}

export default adminSaga;
