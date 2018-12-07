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
        }
    }
};

const theme = CommonUtils.isKommunicateDashboard() ? themes.kommunicate : themes.applozic;

export default theme;