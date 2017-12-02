import React, { Component } from 'react';
import { Progress } from 'reactstrap';
import { getConfig } from '../../config/config';

class Conversations extends Component {

  componentWillMount() {
    document.body.classList.toggle('aside-menu-hidden');
    const autoSuggestUrl = getConfig().kommunicateApi.autoSuggest + '/' + localStorage.getItem("applicationId")
    window.getSuggestions(autoSuggestUrl);

    /*if (window.$kmApplozic(".left .person").length > 0 && window.$kmApplozic(".left .person.active").length === 0) {
      window.$kmApplozic(".left .person:first").trigger('click');
    }*/
  }

  componentWillUnmount() {
    document.body.classList.toggle('aside-menu-hidden');
    if (window.$kmApplozic.fn.applozic("getLoggedInUser")) {
      window.$kmApplozic.fn.applozic('loadTab', '');
    }
  }

  render() {
    return (
      <div className="animated fadeIn">

      </div>
    )
  }
}

export default Conversations;
