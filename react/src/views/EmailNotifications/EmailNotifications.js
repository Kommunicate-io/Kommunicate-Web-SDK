import React, {Component} from 'react';
import './EmailNotifications.css';
import CommonUtils from '../../utils/CommonUtils';
import Notification from '../../views/model/Notification';
import axios from 'axios';
import { getConfig } from '../../config/config';
import Select from 'react-select';
import {SettingsHeader} from '../../../src/components/SettingsComponent/SettingsComponents';
import LearnMoreButton from '../../components/LearnMoreButton/LearnMoreButton';


export default class EmailNotification extends Component {

    constructor(props) {
    super(props);
        this.state = {
            selectedOption: { value: 4, label: 'Only conversations assigned to me' },
            emailNotificationState: CommonUtils.getUserSession().notifyState
        }
    };
    

    componentDidMount() {
        this.setState({
            selectedOption: { value: this.state.emailNotificationState, label: (this.state.emailNotificationState == 1) ? 'All conversations' : (this.state.emailNotificationState == 4) ? 'Only conversations assigned to me' : 'Do not email me any message notifications'}
        })
        console.log(this.state.emailNotificationState);
    }


    updateEmailNotification = (selectedOption) => {
        let emailNotifyState = CommonUtils.getUserSession();
        emailNotifyState.notifyState = selectedOption.value;
        var postData = {
            state: selectedOption.value,
            userId: CommonUtils.getUserSession().email
          };
      
          let axiosConfig = {
            headers: {
                "Apz-Token": "Basic " + CommonUtils.getUserSession().apzToken,
                "Content-Type": "application/json",
                "Apz-AppId": CommonUtils.getUserSession().applicationId,
                "Apz-Product-App": true,
            }
          };
      
          axios.post(getConfig().applozicPlugin.updateApplozicUser, postData, axiosConfig)
          .then((res) => {
            // console.log("RESPONSE RECEIVED: ", res);
            Notification.success("Email notification preferences updated successfully");
            CommonUtils.setUserSession(emailNotifyState);
          })
          .catch((err) => {
            // console.log("AXIOS ERROR: ", err);
            Notification.error("Could not update email notification preferences, please try again");
          })
    }

    handleChange = (selectedOption) => {
        this.setState({ selectedOption });
        this.updateEmailNotification(selectedOption);
        console.log(`Option selected:`, selectedOption);
    }

    render() {

        const { selectedOption } = this.state;

        return(
            <div className="animated fadeIn email-notifications-div">
             <div className="km-heading-wrapper">
					<SettingsHeader  />
				</div>
                <div className="row">
                    <div className="col-sm-12 col-md-8">
                        <div className="email-notifications-dropdown-container">
                            <p className="email-notifications-description">Email notifications will be sent for:</p>
                            <Select
                                name="email-notifications-select"
                                clearable={false}
                                searchable={false}
                                value={selectedOption}
                                onChange={this.handleChange}
                                options={[
                                    { value: 1, label: 'All conversations' },
                                    { value: 4, label: 'Only conversations assigned to me' },
                                    { value: 0, label: 'Do not email me any message notifications' }
                                ]}
                            />
                        </div>
                    </div>
                </div> 
                <div style={{width : "100%", maxWidth:"930px"}} className="col-md-12"><LearnMoreButton url="https://www.kommunicate.io/blog/mailbox-and-email-support-kommunicate-knowledge-base/" label ="Learn More"/></div>
            </div>
        );
    }
}