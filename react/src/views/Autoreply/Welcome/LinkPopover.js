import Popover from './InsertLinkPopoverTemplate';
import React, { Component } from 'react';

import {
  Row,
  Col,
  Button,
  Card,
  CardHeader,
  CardFooter,
  CardBody,
  Form,
  FormGroup,
  FormText,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton
} from 'reactstrap';


class LinkPopover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleClick(e) {
    e.preventDefault();
    this.setState({open: !this.state.open});
  }

  handleClose(e) {
    e.preventDefault();
    this.setState({open: false});
  }

  render() {
    return (
      <div>
        <button className="welcome-msg-textarea-button" ref="target" onClick={this.handleClick}><i className="icon-link icons"></i> Insert Link </button>
        <Popover
          placement='right'
          container={this}
          target={this.refs.target}
          show={this.state.open}
          onHide={this.handleClose}
          containerStyle={{zIndex: 10000}}
          // style={{backgroundColor:"#e3e5e7", borderRadius: "3px", letterSpacing: "1px",color: "#4a4949"}}
          >
          <div>
            <h3>
              Insert Link
            </h3>
            <FormGroup row>
              <Col md="4">
                <Label htmlFor="text-input">Text to display</Label>
              </Col>
              <Col xs="12" md="8">
                <Input type="text" id="text-input" name="text-input" placeholder="Text to display"/>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="4">
                <Label htmlFor="email-input">URL</Label>
              </Col>
              <Col xs="12" md="8">
                <Input type="email" id="email-input" name="email-input" placeholder="URL"/>
              </Col>
            </FormGroup>
            <Button>OK</Button>
            <Button onClick={this.handleClose}>CANCEL</Button>   
          </div>    
        </Popover>
      </div>
    );
  }
}

export default LinkPopover;