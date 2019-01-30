// import theme from 'styled-theming';
import Colors from './colors';
import CommonUtils from '../../utils/CommonUtils';

const themes = {
    applozic: {
        primary: Colors.ApplozicColors.primary,
        primaryLight: Colors.ApplozicColors.primaryLight,
        secondary: Colors.ApplozicColors.secondary,
        buttons: {
            primaryBG: Colors.ApplozicColors.primary,
            primaryText: Colors.CommonColors.White,
            secondaryBG: Colors.CommonColors.White,
            secondaryText: Colors.ApplozicColors.primary,
            hover: Colors.ApplozicColors.hover,
            shadow: Colors.CommonColors.shadowDarkSubtle,
            dangerBG: Colors.CommonColors.danger,
            dangerBGHover: Colors.CommonColors.dangerHover,
            disabledBG: Colors.CommonColors.disabledBG,
            disabledText: Colors.CommonColors.disabledText
        },
        gradients: {
            loginGradientColorStop0: Colors.ApplozicColors.gradient0,
            loginGradientColorStop1: Colors.ApplozicColors.gradient1,
            loginGradientColorStop2: Colors.ApplozicColors.gradient2
        }
        
    },
    kommunicate: {
        primary: Colors.KommunicateColors.primary,
        primaryLight: Colors.KommunicateColors.primaryLight,
        secondary: Colors.KommunicateColors.secondary,
        buttons: {
            primaryBG: Colors.KommunicateColors.primary,
            primaryText: Colors.CommonColors.White,
            secondaryBG: Colors.CommonColors.White,
            secondaryText: Colors.KommunicateColors.primary,
            hover: Colors.KommunicateColors.hover,
            shadow: Colors.CommonColors.shadowDarkSubtle,
            dangerBG: Colors.CommonColors.danger,
            dangerBGHover: Colors.CommonColors.dangerHover,
            disabledBG: Colors.CommonColors.disabledBG,
            disabledText: Colors.CommonColors.disabledText
        },
        gradients: {
            loginGradientColorStop0: Colors.KommunicateColors.gradient0,
            loginGradientColorStop1: Colors.KommunicateColors.gradient1,
            loginGradientColorStop2: Colors.KommunicateColors.gradient2
        }
        
    }
};

const theme = CommonUtils.isKommunicateDashboard() ? themes.kommunicate : themes.applozic;

export default theme;