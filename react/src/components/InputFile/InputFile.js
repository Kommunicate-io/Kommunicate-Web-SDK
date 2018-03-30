import React, { Component, PropTypes } from 'react';
import './InputFile.css';

export default class InputFile extends Component {

    constructor(props: any)
    {
        super(props);
        this.state = {message:'some initial message', text: props.text, id: props.id, multiple: props.multiple, accept: props.accept, className: props.className,onBlur:props.onBlur};
        // this.state = { text: props.text, id: props.id, multiple: props.multiple };
        this.getUploadedFileName = this.getUploadedFileName.bind(this);
    }

    // getUploadedFileName(selectorFiles: FileList, props) {

    //     const { id } = this.props;

    //     ;( function ( document, window, index )
    //     {
    //         var inputs = document.querySelectorAll(`#${id}`);
    //         Array.prototype.forEach.call( inputs, function( input )
    //         {
    //             var label	 = input.nextElementSibling,
    //                 labelVal = label.innerHTML;
        
    //             input.addEventListener( 'change', function( e )
    //             {
    //                 var fileName = '';
    //                 if( input.files && input.files.length > 1 )
    //                     fileName = ( input.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', input.files.length );
    //                 else
    //                     fileName = e.target.value.split( '\\' ).pop();
        
    //                 if( fileName ) {
    //                     this.setState({text : fileName});
    //                 }
                        
    //                 else
    //                     label.innerHTML = labelVal;
    //             });
        
    //             // Firefox bug fix
    //             input.addEventListener( 'focus', function(){ input.classList.add( 'has-focus' ); });
    //             input.addEventListener( 'blur', function(){ input.classList.remove( 'has-focus' ); });
    //         });
    //     }( document, window, 0 ));
    // }


    getUploadedFileName = (e) => {
        let files = e.target.files,
            value = e.target.value,
            message;
        if( files && files.length > 1 ) {
            message = `${files.length} files selected`;
        }
        else {
            message = value.split( '\\' ).pop();
        }                            
        if(message) {
            this.setState({...this.state,message,text:message});
        } 
     }



    render () {

        const { id, text, multiple, accept, className ,onBlur} = this.state;

        return(
            <div>
                <input id={id} type="file" className="km-btn-file" data-multiple-caption={this.state.message} multiple={multiple} onBlur={onBlur} onChange={this.getUploadedFileName} accept={accept}></input>
                <label htmlFor={id} className={(className === 'primary') ? "km-button km-button--primary km-btn-file-label" : (className === 'secondary') ? "km-button km-button--secondary km-btn-file-label" : "km-button km-button--primary km-btn-file-label"}>
                    <span>{text}</span>
                    {/* <span hidden={}>{text}</span> */}
                </label>
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
    onBlur:PropTypes.func,
};