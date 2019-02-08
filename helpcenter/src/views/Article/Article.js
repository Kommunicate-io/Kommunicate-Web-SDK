import React, { Component } from 'react';
import {Container} from '../../components/Container/Container';
import {CommonUtils} from '../../utils/CommonUtils'




export class Article extends Component {
    constructor(props){
        super(props);
        this.state = {
            appID : ""
        };
    };

    componentWillMount(){
        this.setState({appID : CommonUtils.getUrlParameter(window.location.search,"appId") })
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
       
    }
    
    render() {
        return (
                <Container className="animated slide-animated">
                    Articles go here.
                </Container>
        )
    }
}
