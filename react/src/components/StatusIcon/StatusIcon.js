import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './StatusIcon.css';
class StatusIcon extends Component {

    render() {

        const { label } = this.props;
        const { indicator } = this.props;
        return (
            <div className="km-icon-wrapper">
                <div className="km-status-icon">
                   { indicator == "done" &&
                     <svg className="km-status-done-icon" xmlns="http://www.w3.org/2000/svg" width="9" height="7" viewBox="0 0 9 7">
                     <path fill="#fff" fillRule="nonzero" d="M.607 3.443l-.568.529L2.7 6.828 8.941.568 8.393.02 2.7 5.713z"/>
                     </svg>
                   }
                </div>
                <div className="km-status-label">{label}</div>
            </div>
        );
    }
}
StatusIcon.propTypes = {
    indicator: PropTypes.oneOf(["done"]).isRequired,
    label: PropTypes.string.isRequired,
};
export default StatusIcon;