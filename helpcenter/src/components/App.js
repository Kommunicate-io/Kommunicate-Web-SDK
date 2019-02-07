import React, { Component, Fragment } from 'react';
import {Header} from './Header/Header';
import {FaqList} from '../views/FaqList/FaqList';
import { ThemeProvider } from 'styled-components';
import  '../scss/main.scss'
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'



//Converting the sass variables files to JSON to be used throughout the project, no need to import the variables file in any jsx file, all the variables will work out of the box.
const theme = require('sass-extract-loader?{"plugins": ["sass-extract-js"]}!../scss/_variables.scss');

class App extends Component {
    render(){ 
        return ( 
        <div>
            <ThemeProvider theme={theme}>
                <Fragment>
                    <Header/>  
                       <Route path='/'   component={FaqList}/>
                       {/* <Route path='/article'   component={FaqList}/> */}
                </Fragment>
            </ThemeProvider>    
        </div>
        )
    } 
}

export default App;