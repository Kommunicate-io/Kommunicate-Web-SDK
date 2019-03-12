import React, { Component } from 'react'
import { HelpcenterClient } from '../utils/HelpcenterClient';
import { CommonUtils } from '../utils/CommonUtils';
import { StyleUtils } from '../utils/StyleUtils';
import { DEFAULT_HELPCENTER_SETTINGS} from '../utils/Constants';
import { browserHistory } from 'react-router';


export const HelpCenterData = React.createContext({});
const theme = require('sass-extract-loader?{"plugins": ["sass-extract-js"]}!../scss/_variables.scss');


export class HelpCenterDataContext extends Component {
    constructor(props) {
        super(props);
        this.state = {
            baseUrl: '',
            appId: '',
            helpCenter:{}
        }
    }
   
    fetchSettings = () => {
        HelpcenterClient.getAppSettings( CommonUtils.getUrlParameter(window.location.search,'appId') ).then(response => {
            response && response.data && this.setState({
                baseUrl: CommonUtils.getHostNameFromUrl(),
                appId: response.data.response.applicationId,
                helpCenter: response.data.response.helpCenter,
                appIdAvailable : CommonUtils.getUrlParameter(window.location.search,'appId') 
            }, () => {
                this.checkForMissingSettings();
                this.storeSettings();
            })
        })
    }

    checkForMissingSettings = () => {
        !this.state.helpCenter.color && (this.state.helpCenter.color =  DEFAULT_HELPCENTER_SETTINGS.color)
        !this.state.helpCenter.heading && (this.state.helpCenter.heading =  DEFAULT_HELPCENTER_SETTINGS.heading);
        !this.state.helpCenter.logo && (this.state.helpCenter.logo =  DEFAULT_HELPCENTER_SETTINGS.logo);
        !this.state.helpCenter.title && (this.state.helpCenter.title =  DEFAULT_HELPCENTER_SETTINGS.title);
    }

    storeSettings = () => {
        this.setTheme();
        this.updateFavicon();
        this.updateHelpcenterTitle();
    }

    updateFavicon = () =>{
        let favicon = document.getElementById('favicon');
        favicon.href = this.state.helpCenter.favicon;
    }

    updateHelpcenterTitle = () =>{
        document.title = this.state.helpCenter.title + " | Helpcenter";
    } 

    setTheme = () => {
        let primaryColor = this.state.helpCenter.color;
        let themeGradient = StyleUtils.getGradientColor(this.state.helpCenter.color);
        theme.primaryColor = primaryColor;
        theme.gradientColor = themeGradient;
        this.setState({
            theme:theme,
        })
    } 

    componentDidMount = () => {
      this.fetchSettings();
    }
    
    render() {
        return (
            <HelpCenterData.Provider value ={{
                helpCenter : this.state
            }}>
                {this.props.children}
            </HelpCenterData.Provider>    
        )
    }
}
