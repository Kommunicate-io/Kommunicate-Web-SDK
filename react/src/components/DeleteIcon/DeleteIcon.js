import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './DeleteIcon.css';

class DeleteIcon extends Component {

    
    render() {

        const { handleOnClick } = this.props;

        return ( <div className="delete-icon" onClick={handleOnClick}>
            <i className="fa fa-trash-o"></i>
            </div>     
        );
    }
}

DeleteIcon.propTypes = {
    handleOnClick: PropTypes.func.isRequired,

};

export default DeleteIcon;