import React, { Component, PropTypes } from 'react';
import './InputFile.css';

export default class InputFile extends Component {

    constructor(props)
    {
        super(props);
        this.state = {message:'some initial message', text: props.text, id: props.id, multiple: props.multiple, accept: props.accept, className: props.className, onBlur: props.onBlur, hideCloseBtn: true};
        // this.state = { text: props.text, id: props.id, multiple: props.multiple };
        this.getUploadedFileName = this.getUploadedFileName.bind(this);
        this.removeSelectedFiles = this.removeSelectedFiles.bind(this);
    }


    getUploadedFileName = (e) => {
        let files = e.target.files,
            value = e.target.value,
            message;
        if( files && files.length > 1 ) {
            message = `${files.length} files selected`;
            this.setState({ hideCloseBtn: false});
        }
        else {
            message = value.split( '\\' ).pop();
            this.setState({ hideCloseBtn: false});
        }                            
        if(message) {
            this.setState({...this.state,message,text:message, hideCloseBtn: false});
        } 
        return value;
     }

     removeSelectedFiles = ( id, text) => {
        let emptyInputFile = document.getElementById(`${id}`).value = null;
        // console.log(emptyInputFile);
        this.setState({text: this.props.text, hideCloseBtn: true});
     }  



    render () {

        const { id, text, multiple, accept, className, onBlur } = this.state;

        return(
            <div>
                <input id={id} type="file" className="km-btn-file" data-multiple-caption={this.state.message} multiple={multiple} onChange={this.getUploadedFileName} accept={accept} onBlur={onBlur}></input>
                <label htmlFor={id} className={(className === 'primary') ? "km-button km-button--primary km-btn-file-label" : (className === 'secondary') ? "km-button km-button--secondary km-btn-file-label" : "km-button km-button--primary km-btn-file-label"}>
                    <span className={(text !== this.props.text) ? "pad-right-40" : " "}>{text}</span>
                </label>
                <span hidden={this.state.hideCloseBtn} onClick={() => this.removeSelectedFiles( id, text)} className="close-btn-container">
                    <svg xmlns="http://www.w3.org/2000/svg"  fill={(className === 'primary') ? "#FFF" : (className === 'secondary') ? "#5C5AA7" : "#5C5AA7"} height="24" viewBox="0 0 24 24" width="24" style={{margin: "8px 0px -5px 10px", zIndex:20, width:"20px", height:"20px"}}>
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z">
                        </path>
                        <path d="M0 0h24v24H0z" fill="none">
                        </path>
                    </svg>
                    </span>
            </div>
        );
    }   
}

InputFile.propTypes = {
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    multiple: PropTypes.string,
    accept: PropTypes.string,
    className: PropTypes.string,
    onBlur: PropTypes.func,
};