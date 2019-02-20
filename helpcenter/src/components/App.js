import React, { Component, Fragment } from 'react';
import Header from './Header/Header';
import FaqList from '../views/FaqList/FaqList';
import  Article from '../views/Article/Article';
import { ThemeProvider } from 'styled-components';
import  '../scss/main.scss'
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'
import  PoweredByKommunicate  from '../components/PoweredByKommunicate/PoweredByKommunicate'
import {StyleUtils} from '../utils/StyleUtils'
import  PageNotFound  from '../views/PageNotFound/PageNotFound'

//Converting the sass variables files to JSON to be used throughout the project, no need to import the variables file in any jsx file, all the variables will work out of the box.
const theme = require('sass-extract-loader?{"plugins": ["sass-extract-js"]}!../scss/_variables.scss');
theme.gradientColor = StyleUtils.getGradientColor(theme.primaryColor);

class App extends Component {
   
    render(){ 
        return ( 
        <div>
            <ThemeProvider theme={theme}>
                <Fragment>
                    {
                        !location.pathname.includes('404') && <Header/> 
                    }
                        <Switch>
                            <Route exact path='/'  component={FaqList}/>
                            <Route path='/article'  component={Article}/>
                            <Route component={PageNotFound} />
                        </Switch>
                    {
                        !location.pathname.includes('404') && <PoweredByKommunicate fill={"#cacaca"} textColor={"#cacaca"} />
                    }
                    
                </Fragment>
            </ThemeProvider>    
        </div>
        )
    } 
}
export default App;