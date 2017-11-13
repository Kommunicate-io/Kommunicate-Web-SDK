import React, { Component } from 'react';

class Footer extends Component {

  openUserReport() {
    console.log("####inside openUserReport");
    window._urq.push(['Feedback_Open']);
    //alert('hello');
  }

  render() {
    return (
      <footer className="app-footer">
        <div className="center">
          <input type="button" className="user-report btn btn-sm btn-success" onClick={this.openUserReport} value="Ask for a feature" />
        </div>
      </footer>
    )
  }
}

export default Footer;
