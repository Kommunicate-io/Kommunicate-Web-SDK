import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as BannerStyles from './styled';
import { BannerIcons } from '../../assets/svg/svgs';


/**
 * Props for Banner V2 Component are as follows:
 * 
 * @param {String} cssClass     (Optional) Add a parent class name to the component to modify its CSS
 * @param {String} appearance   (Required) Type of Banner. Can be one of "warning", "success", "info" or "error". Default is "info".
 * @param {Any} heading         (Required) Heading/Title for the banner.
 * @param {Boolean} hidden      (Optional) Show or hide the banner by adding hidden prop to it which accepts boolean value. Default is "false".
 * 
 * @example 
 * // Following example will render an error banner with a link in its description. The description section can contain any text, html tags, react components to render contents or can be kept empty to render nothing.
 * <Banner appearance="error" heading="This is an example of Error Banner."> This example contains <a href="#">a link</a></Banner>
 */

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