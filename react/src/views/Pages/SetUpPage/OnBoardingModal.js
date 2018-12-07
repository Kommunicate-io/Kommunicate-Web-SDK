import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as Actions from '../../../actions/loginAction'
import Modal from 'react-modal';
import CloseButton from '../../../components/Modal/CloseButton.js'
import CardList from './CardList'

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '580px',
        // maxWidth: '580px',
        overflow: 'visible'
    }
};

class OnBoardingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openModal: true
        }
        // this.openModal = this.openModal.bind(this);
        // this.closeModal = this.closeModal.bind(this);
    }
    closeModal = () => {
        this.setState({ openModal: false });
    }
    render() {
        return (
            <div>
            <Modal isOpen={this.state.openModal} onRequestClose={this.closeModal} style={customStyles} ariaHideApp={false} >
                <CardList />
            </Modal>
        </div>
        )
    }

}
// export default connect(mapStateToProps, mapDispatchToProps)(onBoardingModal)
export default OnBoardingModal