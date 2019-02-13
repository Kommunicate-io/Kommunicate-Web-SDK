import React, { Component } from 'react';
import {Container} from '../../components/Container/Container';
import {CommonUtils} from '../../utils/CommonUtils';
import {ArticleWrapper, ArticleHeading, ArticleContent} from './ArticleComponents';
import  BreadCrumb  from '../../components/BreadCrumb/BreadCrumb'

export default class Article extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appId: '',
            faqIdentifier: '',
            faqHeading: '',
            faqId: '',
            faqContent: ''
        };
    };

    getFaqArticle = ()=>{
        this.setState({
            appId: CommonUtils.getUrlParameter(window.location.search, "appId"),
            faqId: CommonUtils.getUrlParameter(window.location.search, "articleId")
        }, () => {
            CommonUtils.getSelectedFaq(this.state.appId, this.state.faqId).then(response => {
                this.setState({
                    faqHeading: response.data[0].name,
                    faqContent: response.data[0].content,
                    faqId: response.data[0].id
                }),
                document.title = this.state.faqHeading + " | Helpcenter";
            })
        })
    }

    componentDidMount = () => {
        this.getFaqArticle();
    }

    updateArticlesPage = (id) => {
        let faqId = CommonUtils.getUrlParameter(window.location.search, "articleId");
        id != faqId ? this.getFaqArticle() : null;
    }

    componentDidUpdate(prevProps, prevState) {
        let id = prevState.faqId;
        //Interval added to account for the flicker when react re-renders a component
        setInterval(this.updateArticlesPage(id), 1000)
    }
     
    render() {
        return (
                <Container className="animated slide-animated">
                    {
                        this.state.faqContent ? 
                        <ArticleWrapper className="animated slide-animated ">
                            <BreadCrumb 
                                crumbObject={[
                                    {
                                        pageUrl : '/',
                                        queryUrl : '?appId='+this.state.appId,
                                        crumbName : 'Kommunicate Help center'
                                    },
                                    {
                                        pageUrl : '/article',
                                        queryUrl : '?appId='+this.state.appId+'&articleId='+this.state.faqId,
                                        crumbName : this.state.faqHeading
                                    }
                                ]}
                            />
                                <ArticleHeading>{this.state.faqHeading}</ArticleHeading>
                                   <div className="ql-container ql-snow">
                                        <div className="ql-editor">
                                            <ArticleContent dangerouslySetInnerHTML={{__html: this.state.faqContent}} />
                                        </div>
                                   </div>
                        </ArticleWrapper> : ""
                    }
                </Container>
        )
    }
}


