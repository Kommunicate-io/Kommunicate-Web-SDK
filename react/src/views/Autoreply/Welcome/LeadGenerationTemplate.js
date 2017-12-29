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
        <div className="col-11">
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
      </div>
		)
	}
}

export default LeadGenerationTemplate