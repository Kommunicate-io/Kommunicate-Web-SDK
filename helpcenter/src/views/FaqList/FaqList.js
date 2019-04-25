import React, { Component } from 'react';
import {Container} from '../../components/Container/Container';
import {FaqListItem, FaqListContent, FaqListTitle, TotalSearchedItems, NoResultsFoundWrapper} from './FaqListComponents';
import {CommonUtils} from '../../utils/CommonUtils';
import {HelpcenterClient} from '../../utils/HelpcenterClient';
import { withRouter } from 'react-router-dom';
import { NoResultsFoundSvg } from '../../assets/svgAssets';
import { HelpCenterData } from '../../context/HelpcenterDataContext';

class FaqList extends Component {
    static contextType = HelpCenterData;
    constructor(props){
        super(props);
        this.state = {
            faqList : [],
            appId : "",
            companyName: "Kommunicate",
            searchQuery:"",
            isSearchFinished: false
        };
    };


    //Following function will remove all the html tags and will return plain text
    stripHtml = (html) => {
        let temporalDivElement = document.createElement("div");
        temporalDivElement.innerHTML = html;
        return temporalDivElement.textContent || temporalDivElement.innerText || "";
    };

    populateAllFaq = () => {
        this.clearFaqList();
        HelpcenterClient.getAllFaq(this.context.helpCenter.appId).then(response => {
            response && this.setState({
                faqList: response,
                searchQuery: ''
            })
        })
    }
    populateSearchedFaq = () => {
        this.clearFaqList();
        this.setState({
            searchQuery: CommonUtils.getUrlParameter(window.location.search, "q")
        }, () => {
            HelpcenterClient.searchFaq(this.context.helpCenter.appId, this.state.searchQuery).then(response => {
                response && response.data && this.setState({
                    faqList: response.data.filter( value => value !== null),
                    isSearchFinished: true
                })
            })
        })
    }
    openFaqArticle = (query) =>{
        this.props.history.push({
            pathname: '/article/' + CommonUtils.formatFaqQuery(query)
        });
    }
    componentDidMount = () => {
        this.setState({
            searchQuery :  CommonUtils.getUrlParameter(window.location.search,"q"),
        },()=>{
            this.state.searchQuery ? this.populateSearchedFaq() : this.populateAllFaq();
        })

    }
    clearFaqList = () =>{
        this.setState({
            faqList : [],
            isSearchFinished: false
        })
    }
    componentDidUpdate = (prevProps, prevState) => {
      prevProps.location.search !== this.props.location.search && CommonUtils.getUrlParameter(window.location.search,"q") ? this.populateSearchedFaq() : (prevProps.location.key !== this.props.location.key && !CommonUtils.getUrlParameter(window.location.search,"q")) && this.populateAllFaq();
    }
    
    
    render() {
        return (
                <Container className="animated slide-animated">
                {   
                    this.state.searchQuery &&
                    (this.state.faqList.length ?
                    <TotalSearchedItems>{this.state.faqList.length} {this.state.faqList.length > 1 ? 'results' : 'result'  } found for : <span>{this.state.searchQuery}</span></TotalSearchedItems> 
                        :  this.state.isSearchFinished &&
                        <NoResultsFoundWrapper>
                            <NoResultsFoundSvg/>
                                <span>NO RESULT FOUND</span>
                                <span>We couldn’t find what you’re looking for</span>
                        </NoResultsFoundWrapper> )
                }
                {
                    this.state.faqList && this.state.faqList.map((index,data)=> (
                            
                                <FaqListItem key={index.id} onClick={e=>{this.openFaqArticle(index.name)}}>
                                    <FaqListTitle>{index.name}</FaqListTitle>
                                    <FaqListContent>{this.stripHtml(index.content)}</FaqListContent>
                            </FaqListItem>
                        
                    ))
                }
                </Container>
        )
    }
}
FaqList.contextType = HelpCenterData;
export default Object.assign(withRouter(FaqList), { contextType: undefined });