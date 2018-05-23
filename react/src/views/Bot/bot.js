import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import axios from 'axios';
import  {getConfig,getEnvironmentId,get} from '../../config/config.js';
import BotDescription from './BotDescription.js';
import Notification from '../model/Notification';
import {getUsersByType,createCustomerOrAgent, callSendEmailAPI, getIntegratedBots, patchUserInfo, conversationHandlingByBot} from '../../utils/kommunicateClient';
import CommonUtils from '../../utils/CommonUtils';
import Cato from './images/cato-bot-integration.png'
import Amazon from './images/amazon-icon.png'
import Diaglflow from './images/dialogflow-icon.png'
import Microsoft from './images/microsoft-icon.png'
import Tick from './images/tick-icon.png'
import KmIcon from './images/km-icon.png'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import uuid from 'uuid/v1';
import SliderToggle from '../../components/SliderToggle/SliderToggle';
import {Link} from 'react-router-dom';
import './bot.css';
import NoteIcon from './images/note-icon.png';
import IntegratedBots from '../../components/IntegratedBots/IntegratedBots';
import BotStore from './BotStore';
import { SegmentedControl } from 'segmented-control';
import { Tab } from 'semantic-ui-react';
const panes = [
  { menuItem: 'Bot Store', render: () => <Tab.Pane attached={false}><BotStore /></Tab.Pane> },
  { menuItem: 'Integrated Bots', render: () => <Tab.Pane attached={false} ><IntegratedBots/></Tab.Pane> },
]
const TabExampleSecondaryPointing = () => (
  <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
)
class Tabs extends Component {
  render() {
    return (
      <div className="animated fadeIn" >
      {/* Change showNewBot to false to hide new bot section*/}
        <div className="card" style={{display:"block"} }>
          <div className="card-block">
            <div className="bot-main-card-container">
              <div className="row">
                <div style={{width:"100%"}}>
                  <TabExampleSecondaryPointing />
                </div>
                {/* <div className="col-sm-12 km-bot-integration-heading">
                  <p>Integrating a bot will allow you to send answers to some customer <br />queries automatically</p>
                </div> */}
              </div>
              </div>
              </div>
              </div>
      </div>
    )
  }
}
export default Tabs;