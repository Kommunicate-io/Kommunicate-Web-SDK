import React, {Component} from 'react'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

import CategoryDetails from './CategoryDetails'

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
				<div className="row">
					<div className="col-md-4">
						<div className="form-group ml-4 mr-4 mt-4 mb-4" style={{border: "1.5px solid #808080", borderRadius: "5px", backgroundColor: "white", padding: "2px"}}>
							<div className="input-group">
								<input className="from-control" placeholder="Search categories..." style={{width: "80%", border: "none"}} />
								<button className="btn btn-secondary" style={{width: "20%", border: "none"}}>
									<i className="icon-magnifier icons"></i>
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
						<div className="form-group ml-4 mr-4 mt-4 mb-4">
							<table className="table km-auto-replies-add-category">
								<tbody>
									{this.state.categories.map((category, i) => (<tr key={i}><td onClick={() => this.showThisCategory(category)} style={{cursor: "pointer", textAlign: "center"}}><button className="btn btn-secondary" style={{border: "none", width: "100%"}} >{category}</button></td></tr>))}
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