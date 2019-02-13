import React, { Component } from 'react';
import { KommunicateLogo } from '../../assets/svg/svgAssets';
import { CommonUtils } from '../../utils/CommonUtils';
import { withRouter } from 'react-router-dom';
import { BreadCrumbWrapper, BreadCrumbItem, BreadCrumbArrow } from './BreadCrumbComponents';



 class BreadCrumb extends Component {
    constructor(props){
        super(props);
        this.state = {
            breadCrumbArrow : '>'
        };
    };

    navigateViaBreadCrumb = (pageUrl, searchQuery)=>{
        this.props.history.push({
            pathname: pageUrl,
            search: searchQuery,
        });
    }
     
    render() {
        return (
               <BreadCrumbWrapper>
                   {
                    this.props.crumbObject &&  this.props.crumbObject.map((data,index)=> (
                            
                       <div key={index} > 
                           <BreadCrumbItem onClick={()=> {this.navigateViaBreadCrumb(data.pageUrl,data.queryUrl)}}>{data.crumbName}</BreadCrumbItem> 
                           {
                               this.props.crumbObject.length !== index+1 ?  <BreadCrumbArrow >{this.state.breadCrumbArrow}</BreadCrumbArrow> : ""  
                           }
                       </div>
                        
                    ))
                }
               </BreadCrumbWrapper>
        )
    }
}

export default withRouter(BreadCrumb);



