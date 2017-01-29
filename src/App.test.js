import test from 'ava';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';

import getStore from './store';

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Provider store={getStore()}><App /></Provider>, div);
});
