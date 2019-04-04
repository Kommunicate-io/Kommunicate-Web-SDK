import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './DeleteIcon.css';

class DeleteIcon extends Component {

    
    render() {

        const { handleOnClick } = this.props;

        return ( <div className="delete-icon" onClick={handleOnClick}>
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="12" viewBox="0 0 10 12">
                    <g fill="#8B8888" fillRule="nonzero">
                    <path d="M.357 2.5a.357.357 0 0 1 0-.714h9.286a.357.357 0 1 1 0 .714H.357zM5.357 8.929a.357.357 0 1 1-.714 0v-5a.357.357 0 0 1 .714 0v5zM3.928 8.903a.357.357 0 1 1-.713.051l-.357-5a.357.357 0 0 1 .713-.05l.357 5zM6.785 8.954a.357.357 0 1 1-.713-.05l.357-5a.357.357 0 1 1 .713.05l-.357 5z" />
                    <path d="M3.214 2.143a.357.357 0 1 1-.714 0v-.714C2.5.837 2.98.357 3.571.357H6.43C7.02.357 7.5.837 7.5 1.43v.714a.357.357 0 1 1-.714 0v-.714a.357.357 0 0 0-.357-.358H3.57a.357.357 0 0 0-.357.358v.714z" />
                    <path d="M.716 2.173a.357.357 0 0 1 .355-.387H8.93c.209 0 .373.178.355.387l-.66 7.916c-.046.555-.51.982-1.067.982H2.443a1.071 1.071 0 0 1-1.068-.982l-.66-7.916zm.744.327l.627 7.53c.015.185.17.327.356.327h5.114c.186 0 .34-.142.356-.327L8.54 2.5H1.46z" />
                    </g>
                </svg>
            </div>     
        );
    }
}

DeleteIcon.propTypes = {
    handleOnClick: PropTypes.func.isRequired,

};

export default DeleteIcon;