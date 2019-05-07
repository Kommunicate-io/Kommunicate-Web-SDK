import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as DropListStyles from './DropListStyled';

class DropListItems extends Component {

    static defaultProps = {
		appearance: 'default',
		hidden: false,
	};

    render() {

        const { children, hidden, appearance } = this.props;

        return (
            <DropListStyles.DropListItem hidden={hidden} appearance={appearance} {...this.props}>
                {children}
            </DropListStyles.DropListItem>
        );
    }
}

DropListItems.propTypes = {
    children: PropTypes.node.isRequired,
    hidden: PropTypes.bool,
    appearance: PropTypes.oneOf(['default', 'success', 'warning', 'danger']).isRequired,
};

export default DropListItems;