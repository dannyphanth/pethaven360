import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
import {BrowserRouter as Router } from "react-router-dom";
import { RoutesTemplate } from './RoutesTemplate';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <Router>
    <RoutesTemplate />
  </Router>,
  document.getElementById('root')
);
