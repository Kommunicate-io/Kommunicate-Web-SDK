import React, { Component } from 'react';
import { Progress } from 'reactstrap';
import { getConfig } from '../../config/config';

class Conversations extends Component {

  componentWillMount() {
    document.body.classList.toggle('aside-menu-hidden');
    const autoSuggestUrl = getConfig().kommunicateApi.autoSuggest + '/' + localStorage.getItem("applicationId")
    window.getSuggestions(autoSuggestUrl);
  }

  componentWillUnmount() {
    document.body.classList.toggle('aside-menu-hidden');
    window.$kmApplozic.fn.applozic('loadTab', '');
  }

  render() {
    return (
      <div className="animated fadeIn">

      </div>
    )
  }
}

export default Conversations;
