import React, { Component } from 'react';
import CommonUtils from '../../utils/CommonUtils';
import KmDashboard from './KmDashboard';
import AlDashboard from '../../ALDashboard/views/Dashboard/AlDashboard';
import styled, { withTheme } from 'styled-components';


const DashboardContainer = styled.div`
	
`;

const DashboardHeading = styled.h6`
	letter-spacing: 1px;
	text-align: center;
	color: #cacaca;
	text-transform: uppercase;
	position: relative;

	&::before, &::after {
		content: "";
		position: absolute;
		width: 100px;
		height: 0px;
    	border-top: 1px solid #e5e5e5;
		background-color: #e5e5e5;
		top: 50%;
		transform: translateY(-50%);
	}

	&::before {
		right: 100%;
	}
	&::after {
		left: 100%;
	}
`;

const KMDashboard = styled.div`
	.customer-support-analytics-heading {
		max-width: 300px;
		margin: 10px auto 30px;
	}
	.messaging-analytics-heading {
		max-width: 230px;
		margin: 10px auto 30px;
	}
	.early-bird-card {
		border-radius: 4px;
		box-shadow: 0 2px 5px 0 rgba(172, 170, 170, 0.5);
		background-color: #ffffff;
		padding: 10px 20px 0px;
	}
	.dashboard-card {
		border: none;
	}
`;

class Dashboard extends Component {

	renderDashboard = () => {
		let pricingPackage = CommonUtils.getUserSession().application.pricingPackage;

		if(pricingPackage >= 200) {
			return (
				<KMDashboard>
					<DashboardHeading className="customer-support-analytics-heading">Customer Support Analytics</DashboardHeading>
					<KmDashboard />
					<DashboardHeading className="messaging-analytics-heading">Messaging Analytics</DashboardHeading>
					<AlDashboard />
				</KMDashboard>
			);
		} else if (pricingPackage >= 100 && pricingPackage < 200) {
			return <KmDashboard />;
		} else {
			return <AlDashboard />;
		}
	}



	render() {



		return (
			<DashboardContainer className="animated fadeIn">
				{this.renderDashboard()}
			</DashboardContainer>
		);
	}
}

export default withTheme(Dashboard);