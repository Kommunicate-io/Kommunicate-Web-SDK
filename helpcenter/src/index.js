import 'core-js'
import React from 'react';
import ReactDom from 'react-dom';
import App from './components/App';
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'


ReactDom.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>, 
document.getElementById('app'));