import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './styles/bodynew.css'
import { AuthProvider } from './contexts/AuthContexts';
import { BrowserRouter } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <BrowserRouter>
      <App />
  </BrowserRouter>,
  document.getElementById("root")
)

