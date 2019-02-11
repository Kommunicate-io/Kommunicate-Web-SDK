import React, { Component } from 'react';
import {Container} from '../../components/Container/Container';
import {FaqListItem, FaqListContent, FaqListTitle} from './FaqListComponents'
import {CommonUtils} from '../../utils/CommonUtils'




export default class FaqList extends Component {
    constructor(props){
        super(props);
        this.state = {
            faqList : [],
            appId : ""
        };
    };


    //Following function will remove all the html tags and will return plain text
    stripHtml = (html) => {
        let temporalDivElement = document.createElement("div");
        temporalDivElement.innerHTML = html;
        return temporalDivElement.textContent || temporalDivElement.innerText || "";
    };


    componentDidMount = () => {
        this.setState({appId : CommonUtils.getUrlParameter(window.location.search,"appId") },()=>{
            CommonUtils.getAllFaq(this.state.appId).then(response=>{
                this.setState({faqList : response})
            })
        })
    }
    
    render() {
        return (
                <Container className="animated slide-animated">
                {
                    this.state.faqList && this.state.faqList.map((index,data)=> (
                            
                                <FaqListItem key={index.id}>
                                    <FaqListTitle>{index.name}</FaqListTitle>
                                    <FaqListContent>{this.stripHtml(index.content )}</FaqListContent>
                            </FaqListItem>
                        
                    ))
                }
                </Container>
        )
    }
}
