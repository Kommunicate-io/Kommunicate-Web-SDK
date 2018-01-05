import React, {Component} from 'react';

import {
  Button,
  FormGroup,
  FormText,
  Label,
  Input,
  InputGroup,
  InputGroupButton
} from 'reactstrap';

class LeadGenerationTemplate extends Component {

	render() {
		return (
      <div className="form-group row">
        <div className="col-9">
    			<FormGroup className="welcome-msg-textarea-btn-container">
            <div className="controls">
              <InputGroup>
                <Input id="appendedInputButtons" size="16" type="text"/>
                <InputGroupButton>
                  <Button color="primary">Submit</Button>
                </InputGroupButton>
              </InputGroup>
            </div>
          </FormGroup>
        </div>
        <div className={this.props.showDeleteBtn ? "col-3":"n-vis"}>
          <button onClick={this.props.deleteInAppMsg}><i className="fa fa-trash-o fa-lg"></i></button>
        </div>
      </div>
		)
	}
}

export default LeadGenerationTemplate