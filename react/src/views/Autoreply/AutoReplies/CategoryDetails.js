import React, {Component} from 'react'

class CategoryDetails extends Component {

	render(){
		return (
			<div className="col-md-8" style={{borderLeft: "0.5px #a5b0bd dashed"}}>
				<p>You can add Categories for the user to select their issues from.</p>
				<h3>Billing Issue</h3>
				<p>Edit your replies below</p>
				<div className="km-auto-replies-user-chat-preview">
					<div className="input-group" style={{float: "right"}}>
								<p>Billing Issue</p>
					</div>
					<div className="input-group">
								<p>Hi Shyam</p>
							</div>
		      		<div className="input-group">
								<input className="from-control" placeholder="Search.."/>
								<button className="btn btn-primary">
									<i className="icon-pencil icons"></i>
								</button>
							</div>
				</div>
			</div>
		)
	}
}

export default CategoryDetails