import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './closeButton.css';
class CloseButton extends Component {
    render() {

        const { onClick } = this.props;

        return (
            <div className="km-close-modal-wrapper" onClick={onClick}>
                <span className="km-modal-close-text">close</span>
                <span className="km-modal-close-icon-wrapper"><svg className="km-modal-close-icon" xmlns="http://www.w3.org/2000/svg" fill="#FFF" height="24" viewBox="0 0 24 24" width="24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    <path d="M0 0h24v24H0z" fill="none" />
                </svg></span>
            </div>
        );
    }
}

CloseButton.propTypes = {
    onClick: PropTypes.func
}

export default CloseButton;