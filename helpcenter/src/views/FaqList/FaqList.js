import React, { Component } from 'react';
import {Container} from '../../components/Container/Container';
import {FaqListItem, FaqListContent, FaqListTitle, TotalSearchedItems, NoResultsFoundWrapper} from './FaqListComponents'
import {CommonUtils} from '../../utils/CommonUtils'
import { withRouter } from 'react-router-dom';
import { NoResultsFoundSvg } from '../../assets/svgAssets'

class FaqList extends Component {
    constructor(props){
        super(props);
        this.state = {
            faqList : [],
            appId : "",
            companyName: "Kommunicate",
            searchQuery:""
        };
    };


    //Following function will remove all the html tags and will return plain text
    stripHtml = (html) => {
        let temporalDivElement = document.createElement("div");
        temporalDivElement.innerHTML = html;
        return temporalDivElement.textContent || temporalDivElement.innerText || "";
    };

    populateAllFaq = () =>{
        this.setState({appId : CommonUtils.getUrlParameter(window.location.search,"appId") },()=>{
            CommonUtils.getAllFaq(this.state.appId).then(response=>{
                this.setState({
                    faqList : response,
                    searchQuery : ''
                })
            })
        })
        document.title = this.state.companyName + " | Helpcenter";
    }
    populateSearchedFaq = () => {
        this.setState({
            appId: CommonUtils.getUrlParameter(window.location.search, "appId"),
            searchQuery: CommonUtils.getUrlParameter(window.location.search, "q")
        }, () => {
            CommonUtils.searchFaq(this.state.appId, this.state.searchQuery).then(response => {
                this.setState({
                    faqList: response.data
                })
            })
        })
        document.title = this.state.companyName + " | Helpcenter";
    }
    openFaqArticle = (indexId) =>{
        let searchQuery = '?appId='+this.state.appId+"&articleId="+indexId;
        this.props.history.push({
        pathname: '/article',
        search: searchQuery, 
        });
    }
    componentDidMount = () => {
        this.setState({
            searchQuery :  CommonUtils.getUrlParameter(window.location.search,"q")
        },()=>{
            !this.state.searchQuery ? this.populateAllFaq() : this.populateSearchedFaq();
        })

    }
    componentDidUpdate = (prevProps, prevState) => {
      prevProps.location.search !== this.props.location.search && CommonUtils.getUrlParameter(window.location.search,"q") ? this.populateSearchedFaq() : (prevProps.location.key !== this.props.location.key) && this.populateAllFaq();
    }
    
    
    render() {
        return (
                <Container className="animated slide-animated">
                {
                    (this.state.searchQuery && this.state.faqList.length) ?
                    <TotalSearchedItems>{this.state.faqList.length} {this.state.faqList.length > 1 ? 'results' : 'result'  } found for : <span>{this.state.searchQuery}</span></TotalSearchedItems> 
                        : 
                    this.state.searchQuery && 
                        <NoResultsFoundWrapper>
                            <NoResultsFoundSvg/>
                                <span>NO RESULT FOUND</span>
                                <span>We couldn’t fnd what you’re looking for</span>
                        </NoResultsFoundWrapper>
                }
                {
                    this.state.faqList && this.state.faqList.map((index,data)=> (
                            
                                <FaqListItem key={index.id} onClick={e=>{this.openFaqArticle(index.id)}}>
                                    <FaqListTitle>{index.name}</FaqListTitle>
                                    <FaqListContent>{this.stripHtml(index.content )}</FaqListContent>
                            </FaqListItem>
                        
                    ))
                }
                </Container>
        )
    }
}
export default withRouter(FaqList);
