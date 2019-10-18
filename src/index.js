import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter, { history } from './routers/AppRouter';

import * as serviceWorker from './serviceWorker';
const jsx = (
  <AppRouter />
);

ReactDOM.render(jsx, document.getElementById('root'));

if (history.location.pathname === '/') {
  history.push('/base');
}

// Create-react-app:
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
