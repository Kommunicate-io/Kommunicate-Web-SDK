import React, {Component} from 'react'
import {Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardHeader, CardBody} from 'reactstrap';
import {Popover, PopoverTitle, PopoverContent} from 'reactstrap';
class CategoryDetail extends Component {

	constructor(props){
		super(props)

		this.state = {
			showAutoReplyModal: false,
			addAutoReply: false
		}

		this.toggleAutoReplyModal = this.toggleAutoReplyModal.bind(this)
		this.showAutoReplySection = this.showAutoReplySection.bind(this)
	}

	toggleAutoReplyModal = () => {
		this.setState({
			showAutoReplyModal: !this.state.showAutoReplyModal
		})
	}

	showAutoReplySection = () => {
		this.setState({
			addAutoReply: true
		})
	}

	render(){
		console.log(this.state)
		console.log(this.props)
		return (
			<div style={{textAlign: "center"}}>
				<div className={this.props.show ? "":"n-vis"} >
					<h3>{this.props.details.name}</h3>
					<p>Edit your replies in the space below</p>
					<div className="km-auto-replies-user-chat-preview">
						<div style={{height: "210px"}}>
							<div className="input-group km-auto-replies-right-msg-container">
								<p>{this.props.details.name}</p>
							</div>
							{
							// <div className="input-group km-auto-replies-left-msg-container">
							// 	<p>Hi Shyam</p>
							// </div>
							}
			      	<div className={this.state.addAutoReply ? "input-group": "n-vis"}>
								<input className="from-control" placeholder="Search.." />
								<button className="btn btn-primary" onClick={this.toggleAutoReplyModal}>
									<i className="icon-pencil icons"></i>
								</button>
								<button className="btn btn-secondary"><i className="fa fa-trash-o fa-lg"></i></button>
							</div>
						</div>
						<div>
							<button className="btn btn-primary km-auto-replies-user-chat-preview-bttm-btn" onClick={this.showAutoReplySection}>
								Click here to add a auto-reply
							</button>
						</div>
					</div>
					<Modal isOpen={this.state.showAutoReplyModal} toggle={this.toggleAutoReplyModal} className="modal-dialog">
				    <ModalHeader toggle={this.toggleAutoReplyModal}>{"First reponse to " + this.props.details.name}</ModalHeader>
			      <ModalBody>
			        <div className="form-group">
								<div className="input-group">
									<button className="btn btn-secondary" onClick={this.addCategories}>
										<i className="icon-plus icons font-4xl"></i>
									</button>
									<input className="form-control" placeholder="Type your issue category here..." onChange={this.getCategoryName} value={this.state.categoryName} />
									<button className="btn btn-primary" onClick={this.addCategories}>
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
			<div className="col-md-8" style={{borderLeft: "0.5px #a5b0bd dashed", minHeight: "300px"}}>
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