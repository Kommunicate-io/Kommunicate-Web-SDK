import React, { Component } from 'react'
import validator from 'validator';
import './AutoSuggest.css'
import Notification from '../model/Notification';
import { getAllSuggestions, getSuggestionsByAppId, createSuggestions, deleteSuggestionsById } from '../../utils/kommunicateClient'
import CommonUtils from '../../utils/CommonUtils';

class AutoSuggest extends Component {
	
	state = {
		category: '',
		shortcut: '',
		name: '',
		content: '',
		message: '',
		autoSuggestions: [],
		viewAllSuggestions: false,
		categories: [],
		userShortcuts: [],
		activeTextField: -1,
		activeMenu: -1,
		visible: false,
		enableTextFiled: -1,
		createDisable: false,
		deleteSuggestionId:0
	}

	componentDidMount() {
		// getAllSuggestions()
		// 	.then(autoSuggestions => {
		// 		this.setState({autoSuggestions: autoSuggestions})
		// 		console.log(this.state.autoSuggestions)
		// 		console.log(this.state.categories)
		// 	})
		let userSession = CommonUtils.getUserSession();

		getSuggestionsByAppId(userSession.application.applicationId)
			.then(autoSuggestions => {
				let userShortcuts = [];
				autoSuggestions.forEach(item => {
					userShortcuts.push({
						shortcutField: item.category,
						messageField: item.content,
						suggestionId: item.id
					})
				})

				this.setState({
					userShortcuts: userShortcuts.reverse()
				})

				this.setState({ autoSuggestions: autoSuggestions })

				// console.log(this.state.autoSuggestions)
				// console.log(this.state.categories)
			}).catch(err => {
				console.log(err)
			})
	}

	viewAllSuggestions = () => {
		let userSession = CommonUtils.getUserSession();

		this.setState({ viewAllSuggestions: !this.state.viewAllSuggestions })
		getSuggestionsByAppId(userSession.application.applicationId)
			.then(autoSuggestions => {
				this.setState({ autoSuggestions: autoSuggestions })
				console.log(this.state.autoSuggestions)
				console.log(this.state.categories)
			})
	}

	// _createSuggestion = (e) => {
	// 	e.preventDefault();
	// 	//if(validator.isEmpty(this.state.category) || validator.isEmpty(this.state.name) || validator.isEmpty(this.state.content)){
	// 	if(validator.isEmpty(this.state.shortcut) || validator.isEmpty(this.state.message)){	
	// 	  Notification.info(" All fields are mandatory !!");
	// 	}else{

	// 		const suggestion = {
	// 			applicationId: localStorage.getItem("applicationId"),
	// 			userName: CommonUtils.getUserSession().userName,
	// 		//	category: this.state.category,
	// 		  name: "jithin",
	// 			category: this.state.shortcut,
	// 			content: this.state.message,
	// 		//	content: this.state.content
	// 		}

	// 		createSuggestions(suggestion)
	// 			.then(response => {
	// 				console.log(response)
	// 				if(response.status === 200 && response.data.code === "SUGESSTION_CREATED"){
	// 					Notification.info("Suggestion Created")

	// 					// Refresh the list with the new suggestion
	// 					this.setState((prevState) => {
	// 						autoSuggestions: prevState.autoSuggestions.push(suggestion)
	// 					})

	// 					// Reset the form
	// 					this.resetForm()
	// 				}else{
	// 					Notification.info("There was problem in creating the suggestion.");
	// 				}
	// 			})
	// 			.catch(err => {
	// 				console.log(err)
	// 			})
	// 	}
	// }

	_createSuggestion = (e) => {
		let index = this.state.activeTextField;
		e.preventDefault();
		//if(validator.isEmpty(this.state.category) || validator.isEmpty(this.state.name) || validator.isEmpty(this.state.content)){
		if (validator.isEmpty(this.state.userShortcuts[index].shortcutField) || validator.isEmpty(this.state.userShortcuts[index].messageField)) {
			Notification.info(" All fields are mandatory !!");
		} else {
			let userSession = CommonUtils.getUserSession();

			const suggestion = {
				applicationId: userSession.application.applicationId,
				userName: userSession.userName,
				name: " ",
				category: this.state.userShortcuts[index].shortcutField,
				content: this.state.userShortcuts[index].messageField
			}

			createSuggestions(suggestion)
				.then(response => {
					console.log(response)
					if (response.status === 200 && response.data.code === "SUGESSTION_CREATED") {
						Notification.info("Shortcut created")

						// Refresh the list with the new suggestion
						this.setState((prevState) => {
							autoSuggestions: prevState.autoSuggestions.push(suggestion)
						})
					} else {
						Notification.info("There was problem in creating the suggestion.");
					}
				})
				.catch(err => {
					console.log(err)
				})

		}
		this.setState({
			createDisable: false,
			enableTextFiled: true
		})

	}

	deleteSuggestion = () => {
		let index = this.state.activeMenu;
		//const deleteId = { this.setState({id : this.state.userShortcuts[index].suggestionId })} ;
		
		let userShortcuts = this.state.userShortcuts;
		var  suggestionId= { data: {id : this.state.userShortcuts[index].suggestionId} };
		deleteSuggestionsById(suggestionId)
		.then(response => {
			console.log(response)
			if(response.status === 200 && response.data.code === "SUGESSTION_DELETED_SUCCESSFULLY"){
				Notification.info("Suggestion Deleted")

			}else{
				Notification.info("There was problem in deleting the suggestion.");
			}
		})
		.catch(err => {
			console.log(err)
		})		
		userShortcuts.splice(index,1);

		this.setState({
			userShortcuts: userShortcuts,
			visible: false,
			createDisable: false
		})
		

	}


	appendShorcutFields = () => {

		let fieldGroup = this.state.userShortcuts;

		let fields = {
			shortcutField: '',
			messageField: ''
		};

		fieldGroup.unshift(fields)

		let activeTextField = 0;
		let enableTextFiled = 0;


		this.setState({
			createDisable: true,
			userShortcuts: fieldGroup,
			activeTextField: activeTextField,
			enableTextFiled: enableTextFiled,

		}, (e) => { this.refs.shortcut0.focus() })
		console.log("elements in the array" + this.state.userShortcuts[this.state.index])

	}




	render() {

		const textFields = this.state.userShortcuts.map((shorcut, index) =>
			<form key={this.state.userShortcuts[index].suggestionId}>
				<div className="shortcut-field-wrapper">
					<div className="row">
						<div className="col-md-3 shortcut-col">
							<div className="shortcut-field-group">
								<div className="sign-box">/</div>

								<input type="text" ref={"shortcut" + index} disabled={this.state.enableTextFiled !== index} className="form-control shortcut-field" id="shortcut-field" value={this.state.userShortcuts[index].shortcutField}
									onChange={(e) => {
										let userShortcuts = this.state.userShortcuts;
										userShortcuts[index].shortcutField = e.target.value;
										this.setState({ userShortcuts: userShortcuts })
									}} onFocus={() => this.setState({ activeTextField: index })}
									onKeyPress={(e) => { if (e.charCode === 13) { this.refs.message0.focus() } }} placeholder="" />
								{/* <input type="text" className="form-control shortcut-field" id="shortcut-field" value={this.state.shortcut} onChange={this.handleChange} placeholder="" /> */}
							</div>
						</div>
						<div className="col-md-1 input-link"></div>
						<div className="col-md-4 message-col">
							{/*<div className="field-title">Full Message</div> */}

							<input type="text" ref={"message" + index} disabled={this.state.enableTextFiled !== index} className="form-control message-field" id="message-field" value={this.state.userShortcuts[index].messageField}
								onChange={(e) => {
									let userShortcuts = this.state.userShortcuts;
									userShortcuts[index].messageField = e.target.value;
									this.setState({ userShortcuts: userShortcuts })
								}} onFocus={() => this.setState({ activeTextField: index })}
								onKeyPress={(e) => { if (e.charCode === 13) { this.refs.save0.focus() } }} placeholder="" />


							{
								this.state.activeTextField === index && (this.state.userShortcuts[index].shorcutField || this.state.userShortcuts[index].messageField) &&
								<div className="shortcut-button-group">
									<button type="submit" ref={"save" + index} autoFocus={false} className={this.state.createDisable ? "btn btn-sm shorcut-save-button" : "n-vis"} id="shorcut-save-button" onClick={this._createSuggestion}> Save</button>
									{/* <button type="submit" autoFocus={false} className="btn btn-sm shorcut-cancel-button" id="shorcut-cancel-button" >Cancel</button> */}
								</div>
							}

						</div>
						
						<div className="col-md-2 tooltip-wrapper">
							{/* <div className="arrow-up"></div>  */}
							<p className="tooltip-btn"><div className="ellipsis" onClick={() => this.setState({ activeMenu: index, visible: !this.state.visible })}></div><div className="ellipsis" onClick={() => this.setState({ activeMenu: index, visible: !this.state.visible })}></div><div className="ellipsis" onClick={() => this.setState({ activeMenu: index, visible: !this.state.visible })}></div></p>

							{
								this.state.activeMenu === index && this.state.visible == true &&

								<ul className="tooltip-menu ">
									<li className="tooltip-menu-list" onClick={this.deleteSuggestion}  >Delete</li>
									{/* <li className="tooltip-menu-list" onClick={() => this.setState({activeTextField: index})}>Edit</li> */}
									{/* <hr className="list-divider" /> */}

								</ul>

							}
						</div>
					
					</div>
				</div>
			</form>


		);

		return (

			<div className="animated fadeIn">
				<div className="row">
					<div className="col-sm-12 col-md-8">
						<div className="message-shortcuts-title-wrapper">
							<div className="message-shortcuts-title">Save your time by setting up shortcuts for common responses</div>
							<div className="message-shortcuts-description">(Press / before typing the shortcut term during a conversation to get the full message)</div>
						</div>
						<hr className="title-line" />
					</div>
				</div>
				<div className="row">
					<div className="col-md-12">
						<button disabled={this.state.createDisable} className="btn-primary create-message-shortcut-button" onClick={this.appendShorcutFields} >+ Create Shortcut</button>
					</div>
				</div>

				<div className="field-header">
					<div className="row">
						<div className="col-md-3">
							{this.state.userShortcuts.length > 0 &&
								<div className="field-title">Shortcut</div>
							}
						</div>
						<div className="col-md-1"></div>
						<div className="col-md-4 message-col">
							{this.state.userShortcuts.length > 0 &&
								<div className="field-title">Full Message</div>
							}
						</div>
					</div>
				</div>

				{textFields}
				{/* 
					<div className="shortcut-field-wrapper">
						<div className="row">
							<div className="col-md-3">
							<div className="field-title">Shortcut</div>
									<div className="shortcut-field-group">
										<div className="sign-box">/</div>
										<input type="text" className="form-control shortcut-field" value={this.state.shortcut} onChange={(e) => {this.setState({shortcut: e.target.value})}} placeholder="" />
									</div>				
							</div>						
							<div className="col-md-1"><div classNAme="input-link"></div></div>					
							<div className="col-md-4">
								<div className="field-title">Full Message</div>				
									<input type="text" className="form-control message-field" value={this.state.message} onChange={(e) => {this.setState({message:e.target.value})}}  placeholder="" />			
								</div>
						</div>
						<div className="row">
							<div className="col-md-4"></div>
							<div className="col-md-4">
								<div className="shortcut-button-group"> 
									<button type="submit" autoFocus={false} className="btn btn-sm shorcut-save-button" className="btn btn-sm shorcut-save-button" id="shorcut-save-button" onClick={this._createSuggestion} id="shorcut-save-button" > Save</button>
              		<button type="submit" autoFocus={false} className="btn btn-sm shorcut-cancel-button" id="shorcut-cancel-button" >Cancel</button>
								</div>
							</div>						
							
						</div>
					</div> */}
				{/* 
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
                  <button type="button" className="n-vis btn btn-danger px-4" onClick={this.resetForm}>Cancel</button>
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
					*/}

			</div>
		)
	}
}

export default AutoSuggest