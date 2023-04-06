import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from "./store"

//As Provider name is already being used, therefore, we will use Provider in alert as AlertProvider
import {positions, transitions, Provider as AlertProvider} from 'react-alert'
import AlertTemplate from 'react-alert-template-basic';

const root = ReactDOM.createRoot(document.getElementById('root'));

//These are options/customizations for alert when error will occur
const options = {
  // Alert will be shown for 5 second
  timeout: 5000,
  position: positions.BOTTOM_CENTER,
  transitions: transitions.SCALE
}

root.render(
  <Provider store={store}>
    <AlertProvider template={AlertTemplate} {...options}>
      <App />
    </AlertProvider>
  </Provider>
);
