import React, {Component} from 'react';
import { Link, Switch, Route, Redirect } from 'react-router-dom'

class LoggedInAuthentication extends Component{

    componentDidMount() {
        console.log("component mounted");
          if (!localStorage.getItem('loggedinUser')) {
            <Redirect to="/login"/>
          }
        }

    render() {
        if (localStorage.getItem('loggedinUser')) {
            console.log("User logged in");
            return this.props.children;
        } else {
            console.log("returning null");
            return null;
        }
    }


    
}

export default LoggedInAuthentication;