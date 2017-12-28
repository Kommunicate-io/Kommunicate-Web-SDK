import React, {Component} from 'react'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {Popover, PopoverTitle, PopoverContent} from 'reactstrap';

class CategoryDetail extends Component {

	constructor(props){
		super(props)

		this.state = {
			showAutoReplyModal: false,
			addAutoReply: false,
			showAddAutoReplyBtn :true,
			autoReplyMsg: '',
			autoReplyMsgChatPreview:'',
			popoverOpen: false,
			addPhoneInput: false,
			addEmailInput: false 
		}
	}

	toggleAutoReplyModal = () => {
		this.setState({
			showAutoReplyModal: !this.state.showAutoReplyModal
		})
	}

	showAutoReplySection = () => {
		this.setState({
			addAutoReply: true,
			showAddAutoReplyBtn: false
		})
	}

	getAutoReplyMsg = (e) => {
		e.preventDefault()
		this.setState({
				autoReplyMsg: e.target.value
		})
	}

	addAutoReplyMsgToPreview = () => {
		this.setState({
			autoReplyMsgChatPreview: this.state.autoReplyMsg
		})
	}

	deleteAutoReplyMsgFromPreview = () => {
		this.setState({
			autoReplyMsgChatPreview: '',
			autoReplyMsg: '',
			addPhoneInput: false,
			addEmailInput: false 
		})
	}

	togglePopover = () => {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  addEmailInputToChatPreview = () => {
  	console.log("addEmailInputToChatPreview");
  	this.setState({
      addEmailInput: true
    });
  }

  addPhoneInputToChatPreview = () => {
  	console.log("addPhoneInputToChatPreview");
  	this.setState({
      addPhoneInput: true
    });
  }

	render(){
		// console.log(this.state)
		// console.log(this.props)
		return (
			<div style={{textAlign: "center"}}>
				<div className={this.props.show ? "":"n-vis"} >
					<h3 className="mt-4 mb-4">{this.props.details.name} <button className="btn btn-secondary" style={{border: "none"}}>
									<i className="icon-pencil icons"></i>
							</button>
					</h3>
					<p className="mt-4 mb-12">Edit your replies in the space below</p>
					<div className="km-auto-replies-user-chat-preview">
						<div style={{minHeight: "210px"}} className="mt-4 mb-12">
							<div className="input-group km-auto-replies-right-msg-container">
								<p>{this.props.details.name}</p>
							</div>
							{
							<div className={this.state.autoReplyMsgChatPreview.length > 0 ? "km-auto-replies-left-msg-container":"n-vis"}>
								<div style={{width: "52%", marginRight: "1px", backgroundColor:"#5C5AA7", borderRadius:"10px"}} className="form-group">
									<p style={{marginBottom: "5px"}}>{this.state.autoReplyMsgChatPreview}</p>
									<div style={{marginBottom: "5px"}} className={(this.state.autoReplyMsgChatPreview.length > 0 && this.state.addEmailInput) ? "":"n-vis"}>
										<input style={{marginRight: "1px", fontSize: "13px"}} className={(this.state.autoReplyMsgChatPreview.length > 0 && this.state.addEmailInput) ? "":"n-vis"} placeholder="Please enter your email..."/>
										<button>
									 	Submit
										</button>
									</div>
									<div style={{marginBottom: "5px"}} className={(this.state.autoReplyMsgChatPreview.length > 0 && this.state.addPhoneInput) ? "":"n-vis"}>
										<input style={{marginRight: "1px", fontSize: "13px"}} className={(this.state.autoReplyMsgChatPreview.length > 0 && this.state.addPhoneInput) ? "":"n-vis"} placeholder="Please enter your phone no..."/>
										<button>
										Submit
										</button>
									</div>

								</div>
								<div className="form-group">
									<button className="btn btn-primary" onClick={this.toggleAutoReplyModal}><i className="icon-pencil icons"></i></button>
									<button className="btn btn-secondary" onClick={this.deleteAutoReplyMsgFromPreview}><i className="icon-trash icons"></i></button>
								</div>
							</div>
							}
							{
								// <div className={(this.state.autoReplyMsgChatPreview.length > 0 && this.state.addEmailInput) ? "input-group":"n-vis"}>
								// 	<input className="from-control" placeholder="Please enter your email..."/>
								// 	<button className="btn btn-primary" onClick={this.toggleAutoReplyModal}>
								// 		<i className="icon-pencil icons"></i>
								// 	</button>
								// 	<button className="btn btn-secondary" onClick={this.deleteAutoReplyMsgFromPreview}><i className="icon-trash icons"></i></button>
								// </div>
								// <div className={(this.state.autoReplyMsgChatPreview.length > 0 && this.state.addPhoneInput) ? "input-group":"n-vis"}>
								// 	<input className="from-control" placeholder="Please enter your phone no..."/>
								// 	<button className="btn btn-primary" onClick={this.toggleAutoReplyModal}>
								// 		<i className="icon-pencil icons"></i>
								// 	</button>
								// 	<button className="btn btn-secondary" onClick={this.deleteAutoReplyMsgFromPreview}><i className="icon-trash icons"></i></button>
								// </div>
							}
			      	<div className={this.state.addAutoReply ? "input-group": "n-vis"} style={{padding: "5px"}}>
								<input className="from-control" placeholder="Type your reply here..." style={{width: "50%"}} />
								<button className="btn btn-primary" onClick={this.toggleAutoReplyModal}>
									<i className="icon-pencil icons"></i>
								</button>
								<button className="btn btn-secondary"><i className="icon-trash icons"></i></button>
								<button className="btn btn-secondary"><i className="icon-plus icons"></i></button>
							</div>
						</div>
						<div>
							<button className={this.state.showAddAutoReplyBtn ? "btn btn-primary km-auto-replies-user-chat-preview-bttm-btn":"n-vis"} onClick={this.showAutoReplySection}>
								Click here to add a auto-reply
							</button>
						</div>
					</div>
					<Modal isOpen={this.state.showAutoReplyModal} toggle={this.toggleAutoReplyModal} className="modal-dialog">
				    <ModalHeader toggle={this.toggleAutoReplyModal}>{"First reponse to " + this.props.details.name}</ModalHeader>
			      <ModalBody>
			        <div className="form-group">
								<div className="input-group">
									<button className="btn btn-secondary" id="Popover1" onClick={this.togglePopover}>
										<i className="icon-plus icons font-4xl"></i>
									</button>
									<Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.togglePopover}>
          					<PopoverTitle>Popover Title</PopoverTitle>
          					<PopoverContent>
          							<div>
	          							<button className="btn btn-secondary" style={{width: "100%", textAlign: "left"}} onClick={this.addEmailInputToChatPreview}>
											<i className="icon-envelope icons font-2xl"></i> Add email field
										</button>
									</div>
									<div>
										<button className="btn btn-secondary" style={{width: "100%", textAlign: "left"}} onClick={this.addPhoneInputToChatPreview}>
											<i className="icon-screen-smartphone icons font-2xl"></i> Add phone no. field
										</button>
									</div>
          					</PopoverContent>
        					</Popover>
									<input className="form-control" placeholder="Type your issue category here..." onChange={this.getAutoReplyMsg} value={this.state.autoReplyMsg} />
									<button className="btn btn-primary" onClick={this.addAutoReplyMsgToPreview}>
										Enter
									</button>
								</div>
							</div>
			      </ModalBody>
		        <ModalFooter className="km-auto-replies-modal-footer">
		          <Button color="secondary" onClick={this.toggleAutoReplyModal} className="km-auto-replies-modal-close-btn"><i className="icon-close icons font-4xl"></i></Button>
		        </ModalFooter>
		      </Modal>
				</div>
			</div>
		)
	}
}

class CategoryDetails extends Component {

	constructor(props){
		super(props)
	}

	render(){
		console.log(this.props)
		return (
			<div className="col-md-8" style={{borderLeft: "0.5px #a5b0bd solid", minHeight: "400px"}}>
				<p className={this.props.showBanner ? "":"n-vis"}style={{fontSize: "15px", color:"#808080", position: "absolute", top: "50%" ,left: "20%"}}>You can add Categories for the user to select their issues from.</p>
				{
					this.props.categories.map((category, i) => {
						const name = category.name
						return <CategoryDetail key={i} details={category} show={this.props.showCategories[name]} />
					})
				}
				{
				// <CategoryDetail details={this.props.visibleCategory} />
				}
			</div>
		)
	}
}

export default CategoryDetails