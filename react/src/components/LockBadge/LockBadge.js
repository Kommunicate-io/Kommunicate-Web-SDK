import React, { Component, PropTypes } from 'react';
import './LockBadge.css'
import { BrowserRouter, Link, Route } from 'react-router-dom';

export default class LockBadge extends Component {


    onClick = (onClickGoTo) => {
        this.props.history.push(onClickGoTo);
    }

    render() {

        const { onClickGoTo, text, className } = this.props;

        return(
            <div className="lock-badge-container">
                <div className={className === "lock-only" ? "lock-badge lock-only " : className === "lock-with-text" ? "lock-badge lock-with-text" : "lock-badge lock-with-text"} onClick={(e) => this.onClick(onClickGoTo)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="lock-icon">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="#2fc359"/>
                    </svg>
                    <p className="lock-text">{text}</p>
                </div>
            </div>
        );
    }
}

LockBadge.propTypes = {
    onClick: PropTypes.func,
    text: PropTypes.string,
    className: PropTypes.string,
    onClickGoTo: PropTypes.string
}