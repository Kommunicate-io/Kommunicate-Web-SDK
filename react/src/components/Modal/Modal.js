import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { default as ReactModal } from 'react-modal';
import CloseButton from './CloseButton';
import * as ModalStyles from './styled';

class Modal extends Component {

 	static defaultProps = {
        isOpen: false,
        shouldCloseOnOverlayClick: true
	};

    render() {

        const modalStyles = {
            overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.75)'
            },
            content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
                width: this.props.width || "auto",
                maxWidth: '900px',
                overflow: 'unset',
            }
        };

        const { isOpen, onAfterOpen, onRequestClose, shouldCloseOnOverlayClick, heading } = this.props;

        return (
            <Fragment>
                <ReactModal isOpen={isOpen} onAfterOpen={onAfterOpen} onRequestClose={onRequestClose} style={modalStyles} shouldCloseOnOverlayClick={shouldCloseOnOverlayClick} ariaHideApp={false} >

                    {heading && <Fragment>
                            <ModalStyles.Header>{heading}</ModalStyles.Header>
                            <ModalStyles.Hr />
                        </Fragment>
                    }
                    <Fragment>
                        {this.props.children}
                    </Fragment>

                    <CloseButton onClick={onRequestClose}/>
                </ReactModal>
            </Fragment>
        );
    }
}

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onAfterOpen: PropTypes.func,
    onRequestClose: PropTypes.func.isRequired,
    shouldCloseOnOverlayClick: PropTypes.bool,
    heading: PropTypes.string,
    width: PropTypes.string
};

export default Modal;