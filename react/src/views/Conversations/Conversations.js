import React, { Component } from 'react';
import { Progress } from 'reactstrap';
import { getConfig } from '../../config/config';
import CommonUtils from '../../utils/CommonUtils';

class Conversations extends Component {

  componentWillMount() {
    document.body.classList.toggle('aside-menu-hidden');
    let userSession = CommonUtils.getUserSession();
    const autoSuggestUrl = getConfig().kommunicateApi.autoSuggest + '/' + userSession.application.applicationId
    window.getSuggestions(autoSuggestUrl);

    /*if (window.$kmApplozic(".left .person").length > 0 && window.$kmApplozic(".left .person.active").length === 0) {
      window.$kmApplozic(".left .person:first").trigger('click');
    }*/
    var prevSelection = window.$kmApplozic("#km-contact-list .person.prev-selection");
    if (prevSelection.length === 1) {
      prevSelection.removeClass('prev-selection');      
      prevSelection.trigger('click');
    }
  }

  componentWillUnmount() {
    document.body.classList.toggle('aside-menu-hidden');
    if (window.$kmApplozic.fn.applozic("getLoggedInUser")) {
      window.$kmApplozic("#km-contact-list .person.active").addClass('prev-selection');
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
