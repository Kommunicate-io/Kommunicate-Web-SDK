import React, { Component } from 'react';
import validator from 'validator';
import axios from 'axios';

import Header from '../../../components/Header/';
import SelectStep from './SelectSteps'
import Step1 from './Step1'
import Step2 from './Step2'
import './setup.css'



class SetUpPage extends Component {

	constructor(props) {
		super(props);

		this.state = {
			step: 1,
			isSelectStepHidden:false,
			disableAncher:true
		}
	}

	changeStep = (e) => {
		console.log("changeStep")
		e.preventDefault()
		this.setState({step: 2})
	}

	componentDidMount() {
	}
	componentWillMount(){
		if(this.props.location && this.props.location.pathname ==="/installation" &&this.props.location.search){
			this.state.disableAncher=false;
			 }
	}
	
	render() {
  	return (
  		<div className="app setup-pages-bg">
	  		<header className="app-header navbar">
        		<button className="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" onClick={this.mobileSidebarToggle}>&#9776;</button>
				
				<a href ="https://www.kommunicate.io" target="_blank" className = {this.state.disableAncher?"a-undecorated a-unclickable":"a-undecorated"}> <img src="/img/logo01.svg" height="50" width="50"></img>
        		<span className= "brand-name">KOMMUNICATE</span></a>
        	</header>
  			<div className="row justify-content-center">
	        	<div className="col-md-11 card">
		  			<SelectStep step={this.state.step} location={this.props.location}/>
		  			{this.state.step === 1 ? <Step1 changeStep={this.changeStep} location= {this.props.location}/> : <Step2 history={this.props.history}/>}
	  			</div>
  			</div>
  		</div>
  	)	 
  }
}

export default SetUpPage