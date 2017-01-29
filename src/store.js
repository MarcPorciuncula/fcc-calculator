import { createStore, combineReducers } from 'redux';

import calculator from './reducers/calculator';

export default function getStore() {
  let extension = undefined;
  if (process.env.NODE_ENV !== 'production') {
    extension = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
  }
  return createStore(combineReducers({ calculator }), undefined, extension);
}
