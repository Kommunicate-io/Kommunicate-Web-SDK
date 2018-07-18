import React, { Component, PropTypes } from 'react';
import './StatusIndicator.css';

//Online - success
//Offline - muted
//Away - warning 
//Disabled - error


class StatusIndicator extends Component {

    render() {

        const { label } = this.props;
        const { color } = this.props;
        return (
            <div className="km-status-indicator">
                {/* <div className="km-status-indicator-container km-status-indicator-container--success"> */}
                <div className={color == "success" ? "km-status-indicator-container km-status-indicator-container--success" : color == "warning" ? "km-status-indicator-container km-status-indicator-container--warning" : color == "danger" ? "km-status-indicator-container km-status-indicator-container--danger" : color == "muted" ? "km-status-indicator-container km-status-indicator-container--muted" : "km-status-indicator-container"}>
                    <div className="km-status-indicator-circle"></div>
                    <div className="km-status-indicator-text">{label}</div>
                </div>
            </div>
        );
    }
}
StatusIndicator.propTypes = {
    label: React.PropTypes.string.isRequired
};
export default StatusIndicator;