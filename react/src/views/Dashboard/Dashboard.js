import React, { Component } from 'react';
import CommonUtils from '../../utils/CommonUtils';
import KmDashboard from './KmDashboard';
import AlDashboard from '../../ALDashboard/views/Dashboard/AlDashboard';

class Dashboard extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        {
          CommonUtils.isKommunicateDashboard() ? <KmDashboard /> : <AlDashboard />
        }
      </div>
    );
  }
}

export default Dashboard;