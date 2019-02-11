import React, { Component } from 'react';
import Modal from 'react-modal';
import CloseButton from '../../components/Modal/CloseButton.js'


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '650px',
        overflow: 'visible'
    }
};

class CompanySectionModal extends Component {
    constructor(props){ 
        super(props);
    }
    render() {
        return(
            <div>
                 <Modal isOpen={this.props.openModal} onRequestClose={this.props.controlModal} style={customStyles} ariaHideApp={false} >
                    <div>
                        <p>under construction</p>
                    </div>    
                    <CloseButton onClick={this.props.controlModal} />
                 </Modal>
            </div>
        )
    }
}

export default CompanySectionModal