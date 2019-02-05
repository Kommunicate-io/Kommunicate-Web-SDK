import React, { Component } from 'react';
import {config, getEnvironment}  from '../config/config-env';
import {Header} from './Header/Header';
import { ThemeProvider } from 'styled-components';
import  '../scss/main.scss'

var env = getEnvironment();
var testURL = config[env].baseurl.kommunicateAPI;

//Converting the sass variables files to JSON to be used throught the project, no need to import the variables file in any jsx file, all the variables will work out of the box.
const theme = require('sass-extract-loader?{"plugins": ["sass-extract-js"]}!../scss/_variables.scss');


class App extends Component {
    
    render(){ 
        return ( 
           <div>
            <ThemeProvider theme={theme}>
                <Header/>   
            </ThemeProvider>    
           </div>
        )
    } 
}

export default App;