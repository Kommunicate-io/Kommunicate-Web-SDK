import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ChromePicker } from 'react-color';
import ReactTooltip from 'react-tooltip';
import { InfoIcon } from '../../assets/svg/svgs';

class ColorPicker extends Component {

	state = {
		isOpen: false
	};

	static defaultProps = {
		isOpen: false,
		tooltip: "",
		color: "#5553B7",
		disableAlpha: true
	};

	handleClick = () => {
		this.setState({ isOpen: !this.state.isOpen })
	};

	handleClose = () => {
		this.setState({ isOpen: false })
	};

	render() {

		const { heading, tooltip, color, onChange, disableAlpha, className } = this.props;

		return (
			<ColorPickerContainer className={className}>
				<HeadingContainer className={className && className + "--km-customizer-heading"}>
					<HeadingText className={className && className + "--km-color-picker-heading"}>{heading}</HeadingText>
					{ tooltip && <InfoIcon data-rh-at="right" data-tip={tooltip} data-effect="solid" data-place="right" /> }
				</HeadingContainer>
				<SwatchContainer className={className && className + "--swatch"} onClick={this.handleClick}>
					<SwatchColor className={className && className + "--color"} bgColor={color} />
					<SwatchColorValue>{color}</SwatchColorValue>
				</SwatchContainer>
				{this.state.isOpen && (
					<PopOverContainer className={className && className + "--popover"}>
						<PopOverCover className={className && className + "--cover"} onClick={this.handleClose} />
						<ChromePicker
							disableAlpha={disableAlpha}
							color={color}
							onChange={onChange}
						/>
					</PopOverContainer>
				)}
				<ReactTooltip />
			</ColorPickerContainer>
		);
  	}
}

ColorPicker.propTypes = {
	heading: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired,
	tooltip: PropTypes.string,
    onChange: PropTypes.func.isRequired,
	disableAlpha: PropTypes.bool,
	className: PropTypes.string
};


//Styles 
const ColorPickerContainer = styled.div`
    position: relative;
`;
const HeadingContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
`;
const HeadingText = styled.p`
	font-size: 16px;
	font-weight: 400;
	letter-spacing: 0.6px;
	color: #4a4a4a;
	margin-bottom: 3px;
	margin-right: 5px;
`;
const SwatchContainer = styled(HeadingContainer)`
    width: 150px;
    border-radius: 4px;
    background-color: #ffffff;
    border: solid 1px #a1a1a1;
    padding: 6px 10px;
    cursor: pointer;
`;
const SwatchColor = styled.div`
    border-radius: 2px;
    display: inline-block;
    width: 29px;
    height: 18px;
    cursor: pointer;
    margin-right: 20px;
	background-color: ${props => props.bgColor};
`;
const SwatchColorValue = styled.div``;


const PopOverContainer = styled.div`
	position: absolute;
	z-index: 2;
	top: 65px;
`;
const PopOverCover = styled.div`
	position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
`;


export default ColorPicker;