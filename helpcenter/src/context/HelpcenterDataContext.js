import React, { Component } from 'react'
import { HelpcenterClient } from '../utils/HelpcenterClient';
import { CommonUtils } from '../utils/CommonUtils';
import { StyleUtils } from '../utils/StyleUtils';
import { DEFAULT_HELPCENTER_SETTINGS} from '../utils/Constants';


export const HelpCenterData = React.createContext({});
const theme = require('sass-extract-loader?{"plugins": ["sass-extract-js"]}!../scss/_variables.scss');


export class HelpCenterDataContext extends Component {
    constructor(props) {
        super(props);
        this.state = {
            baseUrl: '',
            appId: '',
            helpCenter:{},
            appIdFromUrl:''
        }
    }
   
    fetchSettings = () => {
        HelpcenterClient.getAppSettings(this.state.appIdFromUrl).then(response => {
            response && response.data && this.setState({
                baseUrl: CommonUtils.getHostNameFromUrl(),
                appId: response.data.response.applicationId,
                helpCenter: response.data.response.helpCenter,
            }, () => {
                this.checkForMissingSettings();
                this.state.helpCenter && this.storeSettings();
            })
        })
    }
    checkForMissingSettings = () => {
        if (this.state.helpCenter) {
            !this.state.helpCenter.color && (this.state.helpCenter.color = DEFAULT_HELPCENTER_SETTINGS.color);
            !this.state.helpCenter.heading && (this.state.helpCenter.heading = DEFAULT_HELPCENTER_SETTINGS.heading);
            !this.state.helpCenter.logo && (this.state.helpCenter.logo = DEFAULT_HELPCENTER_SETTINGS.logo);
            !this.state.helpCenter.title && (this.state.helpCenter.title = DEFAULT_HELPCENTER_SETTINGS.title);
        } else {
            this.setState({
                helpCenter: DEFAULT_HELPCENTER_SETTINGS
            }, () => {
                this.storeSettings();
            })
        }

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
        let primaryColor = this.state.helpCenter.color,
            themeGradient = StyleUtils.getGradientColor(primaryColor),
            primaryColorBrightness = StyleUtils.getColorBrightness(primaryColor), 
            textColor;
        primaryColorBrightness > 150 ? textColor = '#4a4a4a' : textColor = '#fff'; 
        const updatedTheme = Object.assign({}, theme, { 
            primaryColor: primaryColor, 
            gradientColor: themeGradient,
            helpcenterHeadingFontColor : textColor
        });
        this.setState({
            theme:updatedTheme,
        })
    } 

    componentDidMount = () => {
        this.setState({
            appIdFromUrl: CommonUtils.getUrlParameter(window.location.search, 'appId')
        }, () => {
            this.fetchSettings();
        })
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
