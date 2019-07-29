import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppRouter, { history } from './routers/AppRouter';
import configureStore from './store/configureStore';
import * as serviceWorker from './serviceWorker';
// import * as Tone from 'tone';

//create a synth and connect it to the master output (your speakers)
// var synth = new Tone.Synth().toMaster()

//play a middle 'C' for the duration of an 8th note
// synth.triggerAttackRelease('C4', '8n')

const store = configureStore();
const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

ReactDOM.render(jsx, document.getElementById('root'));

if (history.location.pathname === '/') {
  history.push('/base');
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
