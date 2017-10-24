import React, { Component } from 'react'
import validator from 'validator';

import Notification from '../model/Notification';
import { getAllSuggestions, createSuggestions }  from '../../utils/kommunicateClient'


class AutoSuggest extends Component{

	state = {
		category: '',
		name: '',
		content: '',
		autoSuggestions: [],
		viewAllSuggestions: false,
		categories: []
	}

	componentDidMount () {
		getAllSuggestions()
			.then(autoSuggestions => {
				this.setState({autoSuggestions: autoSuggestions})
				console.log(this.state.autoSuggestions)
				console.log(this.state.categories)
			})
	}

	viewAllSuggestions = () => {
		this.setState({viewAllSuggestions: !this.state.viewAllSuggestions})
	}

	_createSuggestion = () => {
		if(validator.isEmpty(this.state.category) || validator.isEmpty(this.state.name) || validator.isEmpty(this.state.content)){
			Notification.info(" All fields are mandatory !!");
		}else{
			const suggestion = {
				category: this.state.category,
				name: this.state.name,
				content: this.state.content
			}
			createSuggestions(suggestion)
		}

	}

	render(){

		return(
	      <div className="animated fadeIn">
	        <div className="row">
	          <div className="col-sm-12 col-md-12">
	            <div className="card">
	              <div className="card-header">
	                <div className="card-block">
	                  <div className="row">
	                    <div className="col-4">
	                      <div className="input-group mb-3">
	                        <span className="input-group-addon">Category</span>
	                        <input type="text" className="form-control" placeholder="Category" value={this.state.category} onChange={(e) => {this.setState({category: e.target.value})}}/>
	                      </div>
	                    </div>
	                    <div className="col-4">
	                      <div className="input-group mb-3">
	                        <span className="input-group-addon">Name</span>
	                        <input type="text" className="form-control" placeholder="Name" value={this.state.name} onChange={(e) => {this.setState({name: e.target.value})}}/>
	                      </div>
	                    </div>
	                    <div className="col-4">
	                      <div className="input-group mb-3">
	                        <span className="input-group-addon">Content</span>
	                        <input type="text" className="form-control" placeholder="Content" value={this.state.content} onChange={(e) => {this.setState({content: e.target.value})}}/>
	                      </div>
	                    </div>
	                  </div>
	                  <div className="row">
	                    <div className="col-6 text-right">
	                      <button type="button" className="btn btn-primary px-4" onClick={this._createSuggestion}>Save Changes</button>
	                    </div>
	                    <div className="col-6 text-left">
	                      <button type="button" className="btn btn-primary px-4">Cancel</button>
	                    </div>
	                  </div>
	                  <div className="row">
	                    <div className="col-12 text-left">
	                      <button className="btn btn-link" onClick={this.viewAllSuggestions}>View All</button>
	                    </div>
	                  </div>
	                  <div className={((this.state.viewAllSuggestions === true)  ? 'form-group' : 'n-vis')}>
	                  	{
	                  		Array.isArray(this.state.autoSuggestions) && (
	                  			this.state.autoSuggestions.map((autoSuggestion, idx) => {
		                  			return (
		                  				<div className="input-group mb-3" key={idx}>
			                  				<span className="input-group-addon">{`#${autoSuggestion.category}`}</span>
			                  				<input type="text" className="form-control" defaultValue={autoSuggestion.name} readOnly={true} />
			                  				<input type="text" className="form-control" defaultValue={autoSuggestion.content} readOnly={true} />
		                  				</div>
		                  			)
	                  			})
	                  		)
	                  	}
	                  </div>
	                </div>
	              </div>
	            </div>
	          </div>
	        </div>
	      </div>
	    )
	}
}

export default AutoSuggest