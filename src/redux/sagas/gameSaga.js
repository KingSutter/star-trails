import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* createSave(action){
    try {
        console.log(action.payload);
        
        yield axios.post('/api/user/save', action.payload);
        // yield put({ type: 'GET_SCENARIOS'});
      } catch (error) {
        console.log('create save post route failed', error);
      }
}

function* getSave(action){
  try {
      const response = yield axios.get('/api/user/save', action.payload);
      yield put({ type: 'SET_SAVE_DATA', payload: response});
    } catch (error) {
      console.log('get save route failed', error);
    }
}

function* gameSaga() {
    yield takeLatest('CREATE_SAVE',createSave);
    yield takeLatest('GET_SAVE',getSave);
  }
  
  export default gameSaga;