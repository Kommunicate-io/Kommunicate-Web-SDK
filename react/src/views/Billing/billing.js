import React, { Component } from 'react';
import CommonUtils from '../../utils/CommonUtils';
import './billing.css';
import BillingApplozic from './billing-al';
import BillingKommunicate from './billing-km';



class Billing extends Component {

    constructor(props) {
        super(props);

        let subscription = CommonUtils.getUserSession().subscription;
        if (typeof CommonUtils.getUserSession().subscription === 'undefined' || CommonUtils.getUserSession().subscription == '' || CommonUtils.getUserSession().subscription == '0') {
            subscription = 'startup';
        }
    };

    render() {
        return CommonUtils.isKommunicateDashboard() ? <BillingKommunicate/>: <BillingApplozic/>;
    }
}

export default Billing;