import React, { Component } from 'react';
import { Progress } from 'reactstrap';
import { getConfig } from '../../config/config';

class Conversations extends Component {

  componentWillMount() {
    document.body.classList.toggle('aside-menu-hidden');
    window.getSuggestions(getConfig().kommunicateApi.autoSuggest);
  }

  componentWillUnmount() {
    document.body.classList.toggle('aside-menu-hidden');
    window.$applozic.fn.applozic('loadTab', '');
  }

  render() {
    return (
      <div className="animated fadeIn">

      </div>
    )
  }
}

export default Conversations;
