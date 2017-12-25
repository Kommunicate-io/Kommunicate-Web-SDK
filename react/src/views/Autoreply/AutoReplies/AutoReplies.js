import React, {Component} from 'react'
import {Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardHeader, CardBody} from 'reactstrap';

import CategoryDetails from './CategoryDetails'

import {
  ButtonGroup,
  ButtonDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu } from 'reactstrap';

class AutoReplies extends Component {

	constructor(props){
		super(props);

		this.state = {
			categoryName: '',
			categoryModal: false,
			categories : [],
			arrayOfCategoryDetails: [],
			arrayOfShowCategoryDetails: {},
			initialShowCategoryDetails: {},
			showBanner: true
		}
	}

	addCategories = (e) => {
		e.preventDefault();

		if(this.state.categoryName.length > 0){
			this.setState((prevState) => {
				return {
					categories: prevState.categories.concat([this.state.categoryName]),
			 		categoryName: '',
			 		arrayOfCategoryDetails: prevState.arrayOfCategoryDetails.concat([{name: this.state.categoryName, showCategory: false}]),
			 		arrayOfShowCategoryDetails: {...prevState.arrayOfShowCategoryDetails, [this.state.categoryName]: false},
			 		initialShowCategoryDetails: {...prevState.initialShowCategoryDetails, [this.state.categoryName]: false},
			 	}
			});
		}
	}

	toggleCategoryModal = () => {
    	this.setState({
      		categoryModal: !this.state.categoryModal
    	});
  	}

	getCategoryName = (e) => {
	  	this.setState({
	  		categoryName: e.target.value
	  	})
	}

	showThisCategory = (category) => {
		this.setState((prevState) => {
			return {
				arrayOfShowCategoryDetails: {...prevState.initialShowCategoryDetails, [category]: true},
				showBanner: false
			}
		})
	}

	render() {
		console.log(this.state);
		return (
			<div className="card">
				<div className="form-group row">
					<div className="col-md-4">
						<div className="form-group  mt-4 mb-4">
							<div className="input-group">
								<input className="from-control" placeholder="Search categories..." style={{width: "70%"}} />
								<button className="btn btn-primary" style={{width: "30%"}}>
									<i className="fa fa-search"></i>
								</button>	
							</div>
						</div>
						<div className="form-group  mt-4 mb-4">
							<div className="input-group">
								<button className="btn btn-primary" onClick={this.toggleCategoryModal} style={{width: "100%"}}>
									<i className="fa fa-plus"></i>  Add Categories
								</button>
							</div>
						</div>
						<div className="form-group">
							<table className="table table-striped">
								<tbody>
									{this.state.categories.map((category, i) => (<tr key={i}><td><button className="btn btn-secondary" key={i} onClick={() => this.showThisCategory(category)}>{category}</button></td></tr>))}
								</tbody>
							</table>
						</div>
					</div>
					<CategoryDetails categories={this.state.arrayOfCategoryDetails} showCategories={this.state.arrayOfShowCategoryDetails} showBanner={this.state.showBanner}/>
				</div>
				<Modal isOpen={this.state.categoryModal} toggle={this.toggleCategoryModal} className="modal-dialog">
		          <ModalHeader toggle={this.toggleCategoryModal}>Add new category</ModalHeader>
		          <ModalBody>
		            <div className="form-group">
									<div className="input-group">
										<input className="form-control" placeholder="Type your issue category here..." onChange={this.getCategoryName} value={this.state.categoryName} />
										<button className="btn btn-primary" onClick={this.addCategories}>
											Enter
										</button>
									</div>
								</div>
		          </ModalBody>
		          <ModalFooter className="km-auto-replies-modal-footer">
		            <Button color="secondary" onClick={this.toggleCategoryModal} className="km-auto-replies-modal-close-btn"><i className="icon-close icons font-4xl"></i></Button>
		          </ModalFooter>
	        	</Modal>
			</div>
		)
	}
}

export default AutoReplies