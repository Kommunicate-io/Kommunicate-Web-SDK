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
				
				<a href ="https://www.kommunicate.io" target="_blank" className = {this.state.disableAncher?"a-undecorated a-unclickable":"a-undecorated"}> <svg xmlns='http://www.w3.org/2000/svg' id='Layer_1' viewBox='0 0 352.7 316.7'>
    <path className='km-logo-final-logo-beta-0' d='M348.5,302.2V121.2c0-65.4-53-118.3-118.3-118.3H122.5C57.1,2.8,4.1,55.8,4.1,121.2 c0,65.4,53,118.4,118.4,118.4H239c0,0,9.5,0.6,15.2,2.6c5.5,2,11.5,6.8,11.5,6.8l72,59.3c0,0,6.5,5.6,8.9,4.5 C349,311.5,348.5,302.2,348.5,302.2z M125.8,145.3c0,7.9-6.9,14.3-15.4,14.3S95,153.2,95,145.3V94.5c0-7.9,6.9-14.3,15.4-14.3 s15.4,6.4,15.4,14.3V145.3z M191.7,169.3c0,7.9-6.9,14.3-15.4,14.3c-8.5,0-15.4-6.4-15.4-14.3V70.5c0-7.9,6.9-14.3,15.4-14.3 c8.5,0,15.4,6.4,15.4,14.3V169.3z M257.6,145.3c0,7.9-6.9,14.3-15.4,14.3c-8.5,0-15.4-6.4-15.4-14.3V94.5c0-7.9,6.9-14.3,15.4-14.3 c8.5,0,15.4,6.4,15.4,14.3V145.3z'
    />
</svg>
        		<span className="beta-text">Beta</span></a>
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