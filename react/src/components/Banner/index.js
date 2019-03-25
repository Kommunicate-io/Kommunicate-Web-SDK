import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as BannerStyles from './styled';
import { BannerIcons } from '../../assets/svg/svgs';

export default class Banner extends Component {
	static defaultProps = {
		appearance: 'info',
		hidden: false,
	};

	render() {
		const { appearance, children, hidden, cssClass, heading } = this.props;

		return (
			<BannerStyles.BannerContainer className={cssClass} hidden={hidden} role="alert" appearance={appearance}>
				<BannerStyles.Content className={cssClass && cssClass + '--content-container'}>
					<BannerStyles.Icon className={cssClass && cssClass + '--content-icon-container'}>
						<BannerIcons />
					</BannerStyles.Icon>
					<BannerStyles.Text className={cssClass && cssClass + '--content-text-container'}>
                        <BannerStyles.Heading className={cssClass && cssClass + '--content-text-heading'}>{heading}</BannerStyles.Heading>
                    	{ children && <BannerStyles.Description className={cssClass && cssClass + '--content-text-content'}>{ children }</BannerStyles.Description>}		
					</BannerStyles.Text>
				</BannerStyles.Content>
			</BannerStyles.BannerContainer>
		);
	}
}


Banner.propTypes = {
    cssClass: PropTypes.string,
    heading: PropTypes.any.isRequired,
	appearance: PropTypes.oneOf(['info', 'success', 'warning', 'error']).isRequired,
	hidden: PropTypes.bool,
};