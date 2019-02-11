import React, { Component } from 'react';
import {Container} from '../../components/Container/Container';
import {CommonUtils} from '../../utils/CommonUtils';
import {ArticleWrapper, ArticleHeading, ArticleContent} from './ArticleComponents';




export default class Article extends Component {
    constructor(props){
        super(props);
        this.state = {
            appId : '',
            faqIdentifier: '',
            faqHeading: '',
            faqId: ''
        };
    };
    
    getFaqArticle = ()=>{
        this.setState({
            appId : CommonUtils.getUrlParameter(window.location.search,"appId"),
            faqId : CommonUtils.getUrlParameter(window.location.search,"articleId")
        },()=>{
            CommonUtils.getSelectedFaq(this.state.appId, this.state.faqId).then(response=>{
                this.setState({
                    faqHeading : response.data[0].name,
                    faqContent: response.data[0].content,
                    faqId : response.data[0].id
                })
            })
        })
    }

    componentDidMount = () => {
        this.getFaqArticle();
    }

    componentDidUpdate(prevProps, prevState) {
        let faqId = CommonUtils.getUrlParameter(window.location.search,"articleId");    
        this.state.faqId !== faqId ? this.getFaqArticle() : "";
    }
     
    render() {
        return (
                <Container className="animated slide-animated">
                    {
                        this.state.faqId ? 
                        <ArticleWrapper className="animated slide-animated">
                            <ArticleHeading>{this.state.faqHeading}</ArticleHeading>
                                <ArticleContent dangerouslySetInnerHTML={{__html: this.state.faqContent}} />
                        </ArticleWrapper> : ""
                    }
                </Container>
        )
    }
}


