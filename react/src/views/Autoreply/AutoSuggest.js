import React, { Component } from 'react'
import validator from 'validator';
import './AutoSuggest.css'
import Notification from '../model/Notification';
import { getAllSuggestions, getSuggestionsByAppId, createSuggestions, deleteSuggestionsById, updateSuggestionsById } from '../../utils/kommunicateClient'
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
		usershortcutsCopy: [],
		activeTextField: -1,
		activeMenu: -1,
		visibleMenu: false,
		visibleButtons: false,
		showEmptyState: true
	}

	componentDidMount() {
		let userSession = CommonUtils.getUserSession();
		getSuggestionsByAppId(userSession.application.applicationId)
			.then(autoSuggestions => {
				let userShortcuts = [];
				let usershortcutsCopy =[];
				autoSuggestions.forEach(item => {
					userShortcuts.push({
						shortcutField: item.category,
						messageField: item.content,
						suggestionId: item.id
					})
					
					usershortcutsCopy.push({
						shortcutField: item.category,
						messageField: item.content,
						suggestionId: item.id
					}) 
					
				})
				usershortcutsCopy = Object.assign([],usershortcutsCopy);
				this.setState({
					userShortcuts: userShortcuts.reverse(),
					usershortcutsCopy: usershortcutsCopy.reverse()	
				})

				this.setState({ 
					autoSuggestions: autoSuggestions, 
				})

				if (userShortcuts.length == 0) {
					this.setState({showEmptyState: false});
				}

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

	
	suggestionMethod =(e) => {
		e.preventDefault();
		let index = this.state.activeTextField;
		let userShortcuts = this.state.userShortcuts;
		var suggestionId = this.state.userShortcuts[index].suggestionId;
		this.setState({
			visibleButtons: false
		})
		if(suggestionId === undefined){	
			this._createSuggestion();
		}
		else{	
		    this.updateSuggestion(index);
		}
	}
	_createSuggestion = (e) => {
		let index = this.state.activeTextField;
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
		if (index == 0 && this.state.userShortcuts[index].shortcutField == '' && this.state.userShortcuts[index].shortcutField == '') {
			this.setState({
				visibleButtons: true
			})
		}
		this.setState({
			//visibleButtons: false,
			activeTextField: !index
		})


	}
	editSuggestion =() => {
		let index = this.state.activeMenu;
		let shortcutRef ="shortcut"+index;
		let ellipsisMenu = "ellipsisMenu"+index
		this.refs[shortcutRef].focus();
		this.setState ({
			visibleMenu:false,
			activeTextField : index
		})
	}
	
	focusEllipsisDropdownMenu = (_this) => {
		let index = this.state.activeMenu;
		let ellipsisMenu = "ellipsis" + index;
		setTimeout(function () {
			_this.refs[ellipsisMenu].focus();
		}, 1);
		
	}
	
	updateSuggestion = (index) => {
		let userShortcuts = this.state.userShortcuts;
		let usershortcutsCopy = this.state.usershortcutsCopy;
		if (validator.isEmpty(this.state.userShortcuts[index].shortcutField) || validator.isEmpty(this.state.userShortcuts[index].messageField)) {
			Notification.info(" All fields are mandatory !!");
		} 
		else {
			const updatedSuggestion = {
				id : this.state.userShortcuts[index].suggestionId,
				category: this.state.userShortcuts[index].shortcutField,
				content: this.state.userShortcuts[index].messageField,
				name: " ",
				
			}
			const updatedSuggestionCopy = {
				suggestionId:this.state.userShortcuts[index].suggestionId,
				shortcutField:this.state.userShortcuts[index].shortcutField,
				messageField: this.state.userShortcuts[index].messageField,
				name: " "
			}
			updateSuggestionsById(updatedSuggestion)
			.then(response => {
				console.log(response)
				if(response.status === 200 && response.data.code === "SUGESSTION_UPDATED_SUCCESSFULLY"){
					Notification.info("Suggestion updated")
	
				}else{
					Notification.info("There was problem in updating the suggestion.");
				}
			})
			.catch(err => {
				console.log(err)
			})
			userShortcuts[index] = Object.assign({},updatedSuggestionCopy)
			usershortcutsCopy[index] = Object.assign({},updatedSuggestionCopy)
			this.setState({
				userShortcuts : userShortcuts,
				usershortcutsCopy : usershortcutsCopy
			})		
		}
		this.setState({
			activeTextField: !index
		})
		
	
	}

	deleteSuggestion = () => {
		let index = this.state.activeMenu;
		let userShortcuts = this.state.userShortcuts;	
		let usershortcutsCopy = this.state.usershortcutsCopy;
		var  suggestionId= { data: {id : this.state.userShortcuts[index].suggestionId} };
		deleteSuggestionsById(suggestionId)
		.then(response => {
			console.log(response)
			if(response.status === 200 && response.data.code === "SUGESSTION_DELETED_SUCCESSFULLY"){
				Notification.info("Suggestion deleted")

			}else{
				Notification.info("There was problem in deleting the suggestion.");
			}
		})
		.catch(err => {
			console.log(err)
		})		
		userShortcuts.splice(index, 1);
		usershortcutsCopy.splice(index,1)

		if (userShortcuts.length == 0) {
			this.setState({showEmptyState: false});
		}
		this.setState({
			userShortcuts: userShortcuts,
			usershortcutsCopy : usershortcutsCopy,
			visibleMenu: false,
			visibleButtons: false
			// showEmptyState: false

		})	
			
	}
	cancelSuggestion = () =>{
		let index = this.state.activeTextField;
		let shortcutRef ="shortcut"+index;
		let messageRef = "message" + index;
		let userShortcuts = this.state.userShortcuts;
		let usershortcutsCopy = this.state.usershortcutsCopy;
		
		if(index == 0 && userShortcuts[index].shortcutField == '' && userShortcuts[index].shortcutField == '' ){
			this.setState({
				userShortcuts: userShortcuts
			})
			userShortcuts.splice(index, 1);
		}
		else {
			userShortcuts[index] = Object.assign([],usershortcutsCopy[index])
			this.setState({
				userShortcuts: userShortcuts
			})
		}

		if(this.refs[shortcutRef].focus == true){
			this.refs[shortcutRef].blur();
		}
		else {
			this.refs[messageRef].blur();
		}
		if (userShortcuts.length == 0) {
			this.setState({showEmptyState: false});
		}
		this.setState({
			visibleButtons: false,
			activeTextField: !index
			// showEmptyState: false
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
		this.setState({
			visibleButtons: true,
			visibleMenu : false,
			userShortcuts: fieldGroup,
			activeTextField: activeTextField,
			showEmptyState: true	
		}, (e) => { this.refs.shortcut0.focus()})
		console.log("elements in the array" + this.state.userShortcuts[this.state.index])

	}


	render() {

		const textFields = this.state.userShortcuts.map((shorcut, index) => {
			let shortcutRef = "shortcut" + index;
			let messageRef = "message" + index;
			let saveRef = "save" + index;
			let ellipsisMenu = "ellipsis" + index;
			return <div key={this.state.userShortcuts[index].suggestionId}>
			<div className="shortcut-field-wrapper">
				<div className="row">
					<div className="col-md-3 shortcut-col">
						<div className="shortcut-field-group">
							<div className="sign-box">/</div>

							<input type="text" ref={shortcutRef} className="form-control shortcut-field" id="shortcut-field" value={this.state.userShortcuts[index].shortcutField}
								onChange={(e) => {
									let userShortcuts = this.state.userShortcuts;
									userShortcuts[index].shortcutField = e.target.value;
									this.setState({ userShortcuts: userShortcuts, visibleButtons:true  })
								}} onFocus={(e) => {
									this.setState({ activeTextField: index, visibleButtons:true})}
								}	
								onKeyPress={(e) => {
									if (e.charCode === 13) { this.refs[messageRef].focus() }}} placeholder="" />
							
						</div>
					</div>
					<div className="col-md-1 input-link"></div>
					<div className="col-md-4 message-col">
						<input type="text" ref={messageRef} className="form-control message-field" id="message-field" value={this.state.userShortcuts[index].messageField}
							onChange={(e) => {
								let userShortcuts = this.state.userShortcuts;
								userShortcuts[index].messageField = e.target.value;
								this.setState({ userShortcuts: userShortcuts, visibleButtons:true })
							}} onFocus={() => this.setState({ activeTextField: index, visibleButtons:true })}
							onKeyPress={(e) => { if (e.charCode === 13) { this.refs[saveRef].focus() } this.setState({visibleButtons:true}) }} placeholder="" />


						{
							this.state.activeTextField === index && 
							<div className="shortcut-button-group">
								<button type="submit" ref={saveRef} autoFocus={false} className={this.state.visibleButtons ? "btn btn-sm shorcut-save-button" : "n-vis"}  id="shorcut-save-button" onClick={this.suggestionMethod}> Save</button>
								<button type="submit" autoFocus={false} className={this.state.visibleButtons ? "btn btn-sm shorcut-cancel-button" : "n-vis" } id="shorcut-cancel-button" onClick={this.cancelSuggestion} >Cancel</button> 
							</div>
						}

					</div>
					
					<div className="col-md-2 tooltip-wrapper">
						{ this.state.activeTextField === index && 
						<p className="edit-tag" >Editing</p>
						}	
						{  this.state.activeTextField !== index &&
								<div className="tooltip-btn" onClick={() => {this.setState({ activeMenu: index, visibleMenu: !this.state.visibleMenu})}}>
									<div className="ellipsis" ></div>
									<div className="ellipsis"></div>
									<div className="ellipsis" ></div>
								</div>
						}
						{this.state.activeMenu === index && this.state.visibleMenu == true &&
							<div tabIndex ={index} ref={ellipsisMenu} onBlur={() => { this.setState({visibleMenu: !this.state.visibleMenu})}} >
								<ul className="tooltip-menu" >
									<li className="tooltip-menu-list" onClick={this.editSuggestion}>Edit</li>
									<hr className="list-divider" />
									<li className="tooltip-menu-list" onClick={this.deleteSuggestion}>Delete</li>
								</ul>
								{this.focusEllipsisDropdownMenu(this)}
							</div>

						}
					</div>
				
				</div>
			</div>
		</div>;
		}		
		);

		return (

			<div className="animated fadeIn message-shortcut-div">
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
						<button disabled={this.state.visibleButtons} className="btn-primary create-message-shortcut-button" onClick={this.appendShorcutFields} >+ Create Shortcut</button>
					</div>
				</div>

				<div className="field-header">
					<div className="row"> 
							<div className="empty-state-message-shortcuts-div text-center col-lg-9" hidden={this.state.showEmptyState}>
								<img src="img/empty-message-shortcuts.png" alt="Message Shortcut Empty State" className="empty-state-message-shortcuts-img"/>
								<p className="empty-state-message-shortcuts-first-text">
									Why don't you create<br></br>your first shortcut here!
								</p>
								<p className="empty-state-message-shortcuts-second-text">
									Save your time by setting up shortcuts<br></br>for common responses
								</p>
							</div>
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
				
			</div>
		)
	}
}

export default AutoSuggest