import Popover from './UserPopoverTemplate';
import React, { Component } from 'react';

class UserPopover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
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
    // console.log(this.props);
    return (
      <div>
        <p className="welcome-user-message" ref="target" onClick={this.handleClick.bind(this)}> {this.props.title} <i className="fa fa-info-circle fa-sm" ></i></p>
        <Popover
          placement='top'
          container={this}
          target={this.refs.target}
          show={this.state.open}
          onHide={this.handleClose.bind(this)}
          style={{backgroundColor:"#e3e5e7", borderRadius: "3px", letterSpacing: "1px",color: "#4a4949"}}>
          <p> {this.props.message}</p>
        </Popover>
      </div>
    );
  }
}

export default UserPopover;