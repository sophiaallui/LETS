import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import "assets/css/nucleo-svg.css";
import "assets/css/nucleo-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-design-system.scss?v1.0.0";
import "assets/css/argon-dashboard-pro-react.css";
import "react-notification-alert/dist/animate.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

