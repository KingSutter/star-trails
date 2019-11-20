import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* createSave(action){
    try {
        yield axios.post('/api/user/save', action.payload);
      } catch (error) {
        console.log('create save post route failed', error);
      }
}

function* getSave(){
  try {
      const response = yield axios.get('/api/user/save');
      yield put({ type: 'SET_SAVE_DATA', payload: response.data});
    } catch (error) {
      console.log('get save route failed', error);
    }
}

function* updateSave(action){
    try {
        const response = yield axios.put('/api/user/save', action.payload);
      } catch (error) {
        console.log('update save put route failed', error);
      }
}

function* gameSaga() {
    yield takeLatest('CREATE_SAVE',createSave);
    yield takeLatest('GET_SAVE',getSave);
    yield takeLatest('UPDATE_SAVE',updateSave);
  }

export default gameSaga;