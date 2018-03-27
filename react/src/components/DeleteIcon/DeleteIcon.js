import React, { Component, PropTypes } from 'react';
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
    handleOnClick: React.PropTypes.func.isRequired,

};

export default DeleteIcon;