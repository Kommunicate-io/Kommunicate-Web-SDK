import React, { Component } from 'react';
import {Container} from '../../components/Container/Container';
import {FaqListItem, FaqListContent, FaqListTitle} from './FaqListComponents'
import {CommonUtils} from '../../utils/CommonUtils'




export class FaqList extends Component {
    constructor(props){
        super(props);
        this.state = {
            faqList : [],
            appID : ""
        };
    };

    componentWillMount(){
        this.setState({appID : CommonUtils.getUrlParameter(window.location.search,"appID") })
    }

    stripHtml = (html) => {
         // Create a new div element
        var temporalDivElement = document.createElement("div");
        // Set the HTML content with the providen
        temporalDivElement.innerHTML = html;
        // Retrieve the text property of the element (cross-browser support)
        return temporalDivElement.textContent || temporalDivElement.innerText || "";
    };

    componentDidMount = () => {
        CommonUtils.getAllFaq(this.state.appID).then(response=>{
            this.setState({faqList : response})
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
