import React, { Component, Fragment } from 'react';
import Header from './Header/Header';
import FaqList from '../views/FaqList/FaqList';
import  Article from '../views/Article/Article';
import  {Loading} from '../views/Loading/Loading';
import { ThemeProvider } from 'styled-components';
import  '../scss/main.scss'
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'
import  PoweredByKommunicate  from '../components/PoweredByKommunicate/PoweredByKommunicate'
import {StyleUtils} from '../utils/StyleUtils'
import  PageNotFound  from '../views/PageNotFound/PageNotFound'
import {CommonUtils} from '../utils/CommonUtils'
import { DEFAULT_HELPCENTER_SETTINGS} from '../utils/Constants'

//Converting the sass variables files to JSON to be used throughout the project, no need to import the variables file in any jsx file, all the variables will work out of the box.
const theme = require('sass-extract-loader?{"plugins": ["sass-extract-js"]}!../scss/_variables.scss');

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appId: '',
            baseUrl: '',
            helpcenterSettings: {},
            settingsExistInLocalStorage:false,
            theme:{}
        };
    };


    fetchSettings = () => {
        CommonUtils.getAppSettings(this.state.appId, this.state.faqId).then(response => {
            response && response.data && this.setState({
                baseUrl: CommonUtils.getHostNameFromUrl(),
                appId: response.data.response.applicationId,
                helpcenterSettings: response.data.response.helpCenter,
            }, () => {
                this.checkForMissingSettings();
                this.storeSettings();
            })
        })
    }

    checkForMissingSettings = () => {
        !this.state.helpcenterSettings.color && (this.state.helpcenterSettings.color =  DEFAULT_HELPCENTER_SETTINGS.color)
        !this.state.helpcenterSettings.heading && (this.state.helpcenterSettings.heading =  DEFAULT_HELPCENTER_SETTINGS.heading);
        !this.state.helpcenterSettings.logo && (this.state.helpcenterSettings.logo =  DEFAULT_HELPCENTER_SETTINGS.logo);
        !this.state.helpcenterSettings.title && (this.state.helpcenterSettings.title =  DEFAULT_HELPCENTER_SETTINGS.title);
    }

    storeSettings = () => {
        this.state.helpcenterSettings.appId = this.state.appId;
        CommonUtils.setItemInLocalStorage(this.state.baseUrl, this.state.helpcenterSettings);
        this.setTheme();
        this.updateFavicon();
        this.updateHelpcenterTitle();
    }

    updateFavicon = () =>{
        let favicon = document.getElementById('favicon');
        favicon.href = this.state.helpcenterSettings.favicon;
    }

    updateHelpcenterTitle = () =>{
        document.title = this.state.helpcenterSettings.title + " | Helpcenter";
    } 

    setTheme = () => {
        let primaryColor = this.state.helpcenterSettings.color;
        let themeGradient = StyleUtils.getGradientColor(this.state.helpcenterSettings.color);
        theme.primaryColor = primaryColor;
        theme.gradientColor = themeGradient;
        this.setState({
            theme:theme,
            settingsExistInLocalStorage:true
        })
    } 

    componentDidMount = () => {
        CommonUtils.removeItemFromLocalStorage(CommonUtils.getHostNameFromUrl());
        this.fetchSettings();   
    }
    

   
    render(){ 
        return ( 
        <div>
            <ThemeProvider theme={this.state.theme}>
             {
                 this.state.settingsExistInLocalStorage ?
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
                :
                <Loading/>
           }
            </ThemeProvider>    
        </div>
        )
    } 
}
export default App;