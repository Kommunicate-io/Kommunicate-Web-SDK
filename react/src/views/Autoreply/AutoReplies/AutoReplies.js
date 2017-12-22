import React, {Component} from 'react'
import {Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardHeader, CardBody} from 'reactstrap';


class AutoReplies extends Component {

	constructor(props){
		super(props);

		this.state = {
			categoryName: '',
			categoryModal: false,
			categories : []
		}

		this.toggleCategoryModal = this.toggleCategoryModal.bind(this);
	}

	addCategories = (e) => {
		e.preventDefault();

		this.setState((prevState) => {
			return {categories: prevState.categories.concat([this.state.categoryName]), categoryName: ''}
		});

	}

	toggleCategoryModal() {
    this.setState({
      categoryModal: !this.state.categoryModal
    });
  }

  getCategoryName = (e) => {
  	this.setState({
  		categoryName: e.target.value
  	})

  }

  setCategoryDetails = () => {

  }

	render() {
		console.log(this.state);
		return (
			<div className="form-group row">
				<div className="col-md-4" style={{border: "0.5px #a5b0bd solid", borderRadius: "3px"}}>
					<div className="form-group">
						<div className="input-group">
							<button className="btn btn-primary">
								<i className="fa fa-search"></i>  Search
							</button>
							<input className="from-control" />
						</div>
					</div>
					<div className="form-group">
						<div className="input-group">
							<button className="btn btn-primary" onClick={this.toggleCategoryModal}>
								<i className="fa fa-plus"></i>  Add Categories
							</button>
						</div>
						<table className="table table-striped">
							<tbody>
								{this.state.categories.map((category, i) => (<tr key={i}><td>{category}</td></tr>))}
							</tbody>
						</table>
					</div>
				</div>
				<div className="col-md-8" style={{border: "0.5px #a5b0bd solid", borderRadius: "3px"}}>
					<p>You can add Categories for the user to select their issues from.</p>
					<h2>Billing Issue</h2>
					<p>Edit your replies below</p>
					<div>
					</div>
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
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleCategoryModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
			</div>
		)
	}
}

export default AutoReplies