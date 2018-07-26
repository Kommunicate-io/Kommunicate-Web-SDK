//display the user/bot status using StatusIndiactor
// label : Online/Enable/Active -> indicator : success
// label : Offline -> indicator : muted
// label : Away -> indicator : warning
// label : Disabled -> indicator : danger
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './StatusIndicator.css';
class StatusIndicator extends Component {

    render() {

        const { label } = this.props;
        const { indicator } = this.props;
        return (
            <div className="km-status-indicator">
                {/* <div className="km-status-indicator-container km-status-indicator-container--success"> */}
                <div className={indicator == "success" ? "km-status-indicator-container km-status-indicator-container--success" : indicator == "warning" ? "km-status-indicator-container km-status-indicator-container--warning" : indicator == "danger" ? "km-status-indicator-container km-status-indicator-container--danger" : indicator == "muted" ? "km-status-indicator-container km-status-indicator-container--muted" : "km-status-indicator-container"}>
                    <div className="km-status-indicator-circle"></div>
                    <div className="km-status-indicator-text">{label}</div>
                </div>
            </div>
        );
    }
}
StatusIndicator.propTypes = {
    indicator: PropTypes.oneOf(["success", "warning", "danger", "muted"]).isRequired,
    label: PropTypes.string.isRequired,
};
export default StatusIndicator;