import React, {Component} from 'react';
import { Link, Switch, Route, Redirect } from 'react-router-dom'
import CommonUtils from '../../../utils/CommonUtils';

class LoggedInAuthentication extends Component{

    componentDidMount() {
        console.log("component mounted");
          if (!CommonUtils.getUserSession()) {
            <Redirect to="/login"/>
          }
        }

    render() {
        if (CommonUtils.getUserSession()) {
            console.log("User logged in");
            return this.props.children;
        } else {
            console.log("returning null");
            return null;
        }
    }


    
}

export default LoggedInAuthentication;