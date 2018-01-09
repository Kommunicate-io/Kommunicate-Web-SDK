import React, { Component } from 'react';
import { getConfig } from '../../config/config';

class Footer extends Component {

  openUserReport() {
    window._urq.push(['Feedback_Open']);
  }

  componentWillMount () {
    //UserReport
    window._urq = window._urq || [];
    window._urq.push(['initSite', 'de3cfc74-25e0-4299-aa3b-7c0746ce5966']);
    var ur = document.createElement('script'); ur.type = 'text/javascript'; ur.async = true;
    ur.src = ('https:' == document.location.protocol ? 'https://cdn.userreport.com/userreport.js' : 'http://cdn.userreport.com/userreport.js');
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ur, s);
  }

  render() {
    return (
      <footer className="app-footer">
        {/*<div className="center">
          <input type="button" className="user-report btn btn-sm btn-success" onClick={this.openUserReport} value="Ask for a feature" />
        </div>
    */}
      </footer>
    )
  }
}

export default Footer;
