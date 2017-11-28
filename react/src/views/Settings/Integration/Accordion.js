import React, { Component } from 'react';
import axios from 'axios';
import Collapsible from 'react-collapsible';
import "./Accordion.css";


class Accordion extends Component{

  
    constructor(props) {
        super(props);
        this.state =  {
          dropDown:false
        };
        this.data=this.props.data
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick (e) { 
      e.preventDefault();
      this.setState({
        dropDown:!this.state.dropDown
      }); 
    }
    componentWillMount () {
      this.data=this.props.data
    }
   componentDidMount(){
      document.getElementById('content-area').innerHTML=this.data.content;
    }

    render () {
        return (
           <div className="col-md-10">
           <div className="title" onClick={this.handleClick}>
           <div className="arrow-wrapper">
               <i className={this.state.dropDown? "fa fa-angle-down fa-rotate-180": "fa fa-angle-down"} ></i>
             </div>
              <span className="title-text"> {this.data.title}</span>  
           </div>
           <div className="thin-line"></div>
           <div className={this.state.dropDown? "content content-open" : "content"}>
             <div id="content-area" className={this.state.dropDown  ? "content-text content-text-open" : "content-text"}> 
             {this.data.content}
             </div>
           </div>
         </div>
        );
       }    
}
export default Accordion;