import React, { Component } from 'react'
import validator from 'validator';

import Notification from '../model/Notification';
import { getAllSuggestions, getSuggestionsByAppId, createSuggestions }  from '../../utils/kommunicateClient'


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
		// getAllSuggestions()
		// 	.then(autoSuggestions => {
		// 		this.setState({autoSuggestions: autoSuggestions})
		// 		console.log(this.state.autoSuggestions)
		// 		console.log(this.state.categories)
		// 	})

		getSuggestionsByAppId(localStorage.getItem("applicationId"))
			.then(autoSuggestions => {
				this.setState({autoSuggestions: autoSuggestions})
				// console.log(this.state.autoSuggestions)
				// console.log(this.state.categories)
			})
	}

	viewAllSuggestions = () => {
		this.setState({viewAllSuggestions: !this.state.viewAllSuggestions})
		getSuggestionsByAppId(localStorage.getItem("applicationId"))
			.then(autoSuggestions => {
				this.setState({autoSuggestions: autoSuggestions})
				console.log(this.state.autoSuggestions)
				console.log(this.state.categories)
			})
	}

	_createSuggestion = () => {
		if(validator.isEmpty(this.state.category) || validator.isEmpty(this.state.name) || validator.isEmpty(this.state.content)){
			Notification.info(" All fields are mandatory !!");
		}else{
			const suggestion = {
				applicationId: localStorage.getItem("applicationId"),
				userName: localStorage.getItem("loggedinUser"),
				category: this.state.category,
				name: this.state.name,
				content: this.state.content
			}

			createSuggestions(suggestion)
				.then(response => {
					console.log(response)
					if(response.status === 200 && response.data.code === "SUGESSTION_CREATED"){
						Notification.info("Suggestion Created")

						// Refresh the list with the new suggestion
						this.setState((prevState) => {
							autoSuggestions: prevState.autoSuggestions.push(suggestion)
						})

						// Reset the form
						this.resetForm()
					}else{
						Notification.info("There was problem in creating the suggestion.");
					}
				})
		}
	}

	resetForm = () => {
		this.setState({
			category: '',
			name: '',
			content: ''
		})
	}

	render(){

		return(
	      <div className="animated fadeIn">
	        <div className="row">
	          <div className="col-sm-12 col-md-12">
	            <div className="card">
	              <div className="card-header">
	              	<strong>Add an auto suggestion</strong>
	              </div>
                <div className="card-block">
                  <div className="row">
                    <div className="col-6">
                      <div className="input-group mb-3">
                        <span className="input-group-addon">Category</span>	
                        <input type="text" className="form-control" placeholder="Category" value={this.state.category} onChange={(e) => {this.setState({category: e.target.value})}}/>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="input-group mb-3">
                        <span className="input-group-addon">Name</span>
                        <input type="text" className="form-control" placeholder="Name" value={this.state.name} onChange={(e) => {this.setState({name: e.target.value})}}/>
                      </div>
                    </div>
                  </div>
                  <div className="row">  
                    <div className="col-12">
                      <div className="input-group mb-3">
                        <span className="input-group-addon">Content</span>
                        <input type="text" className="form-control" placeholder="Content" value={this.state.content} onChange={(e) => {this.setState({content: e.target.value})}}/>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <button type="button" className="btn btn-primary px-4" onClick={this._createSuggestion}>Save</button>
                  <button type="button" className="btn btn-danger px-4" onClick={this.resetForm}>Cancel</button>
                </div>
	            </div>
	            <div className="card">
	              <div className="card-header">
	              	<div className="row">
                  	<div className="col-3 text-left">
                  		<button className="btn btn-link" onClick={this.viewAllSuggestions}>View All Suggestions</button>
                    </div>
                  </div>
	              </div>
	              <div className={((this.state.viewAllSuggestions === true)  ? "card-block" : 'n-vis')}>
	              	<div className="form-group">
                  	{
                  		Array.isArray(this.state.autoSuggestions) && (
                  			this.state.autoSuggestions.map((autoSuggestion, idx) => {
                  				if(autoSuggestion.applicationId === localStorage.getItem("applicationId")){
                  					return (
		                  				<div className="input-group mb-3" key={idx}>
			                  				<span className="input-group-addon">{`#${autoSuggestion.category}`}</span>
			                  				<input type="text" className="form-control" defaultValue={autoSuggestion.name} readOnly={true} />
			                  				<input type="text" className="form-control" defaultValue={autoSuggestion.content} readOnly={true} />
		                  				</div>
	                  				)
                  				}
                  			})
                  		)
                  	}
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