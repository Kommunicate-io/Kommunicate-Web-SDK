import React, { Component } from 'react';
import {config, getEnvironment}  from '../config/config-env';

var env = getEnvironment();
var testURL = config[env].baseurl.kommunicateAPI;


class App extends Component {
    render(){ 
        return ( 
            <div>
            <a href="react.com">{testURL}</a>
            </div>
        )
    } 
}

export default App;