import React, { Component } from "react";
import styled, { withTheme } from "styled-components";
import DateRangePicker from "react-daterange-picker";
import "react-daterange-picker/dist/css/react-calendar.css";
import originalMoment from "moment";
import { extendMoment } from "moment-range";
import CommonUtils from '../../utils/CommonUtils';
import Button from '../../components/Buttons/Button';
import { getConfig } from "../../config/config";

const moment = extendMoment(originalMoment);

class Reports extends Component {

	constructor(props) {
		super(props);

		const today = moment();
		const userSession = CommonUtils.getUserSession();
		const applicationCreatedAtTime = userSession.applicationCreatedAt || userSession.created_at;
		applicationCreatedAtTime.replace('Z','');
		
	
		this.state = {
			applicationCreatedAt: applicationCreatedAtTime,
			value: moment.range(today.clone().subtract(7, "days"), today.clone()),
			currentDate: today.format("DD MMM YYY"),
		};
	};

	onSelect = (value, states) => {
		this.setState({ value, states });
	};

	renderSelectionValue = () => {
		return (
		  <div>
			<Heading>From <Span>{this.state.value.start.format("DD MMM YYYY")}</Span>  to <Span>{this.state.value.end.format("DD MMM YYYY")}</Span></Heading>			
		  </div>
		);
	};

	downloadReport = () => {
		let url = getConfig().kommunicateApi.metabaseUrl;
		url += `/?startDate=${this.state.value.start.format('x')}&endDate=${this.state.value.end.format('x')}&appKey=${CommonUtils.getUserSession().application.key}&format=xlsx`;
		window.open(url);
	}

	render() {
		return (
			<Container className="animated fadeIn">
				<Div className="text-center">{this.renderSelectionValue()}</Div>

				<DatePickerContainer>
					<DateRangePicker
						value={this.state.value}
						onSelect={this.onSelect}
						minimumDate={new Date(this.state.applicationCreatedAt)}
						maximumDate={new Date()}
						numberOfCalendars={2}
						selectionType="range"
					/>
				</DatePickerContainer>

				<ButtonContainer>
					<Button onClick={this.downloadReport}>Download Report</Button>
				</ButtonContainer>

			</Container>
		);
	}
}

// Styles
const Container = styled.div`

	.DateRangePicker {
		border: 1px solid #ebebeb;
		border-radius: 5px;
		padding: 15px;
	}
	.DateRangePicker__PaginationArrow {
		top: 15px;
	}
	.DateRangePicker__CalendarSelection {
		background-color: ${props => props.theme.primary};
    	border: 1px solid ${props => props.theme.primary};
	}
	.DateRangePicker__CalendarHighlight--single {
		border: 1px solid ${props => props.theme.primary};
	}

`;
const DatePickerContainer = styled.div`
	text-align: center;
	margin-top: 30px;
`;
const ButtonContainer = styled(DatePickerContainer)``;
const Div = styled.div``;
const Heading = styled.h3`
`;
const Span = styled.span`
	color: ${props  => props.theme.primary};
`;

export default withTheme(Reports);
