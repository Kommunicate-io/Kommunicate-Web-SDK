import React, { Component, Fragment } from 'react';
import {CommonUtils} from '../../utils/CommonUtils';
import { withRouter } from 'react-router-dom';
import { ClearButton } from '../../assets/svgAssets';
import { ClearButtonWrapper, MenuWrapper, SeeAllButton, SearchBoxWrapper , SearchBox, SearchResultsWrapper,
SearchResults, NoResultFoundMenuButton } from './HeaderComponents'

let fetchFaq;

class HelpQuerySearch extends Component {
    constructor(props){
        super(props);
        this.state = { 
            inputValue: '',
            searchQuery : '',
            faqList: '',
            searchedFaqList: '',
            isDropDownOpen: false,
            value: '',
            key:'',
            totalSearchResults:'',
            maxVisibleSearchedFaq : 5
        };
    }
    getFaqListFromServer = () => {
        var _this = this,
            timeout = 300;
            fetchFaq = setTimeout(() => {    
            this.state.inputValue && CommonUtils.searchFaq(this.state.settings.appId, encodeURIComponent(this.state.inputValue)).then(response => {
                response && response.data && _this.setState({
                    totalSearchResults: response.data.length,
                    searchedFaqList: response.data.slice(0,this.state.maxVisibleSearchedFaq)
                })
            })
        }, timeout);
    }
    filterFaqList = (inputValue) => {
        return this.state.searchedFaqList.slice(0,this.state.maxVisibleSearchedFaq)
    };
      
    loadOptions = () => {
        this.getFaqListFromServer();
        setTimeout(() => {
            callback(this.filterFaqList());
        }, 1000);
    };
    
    handleInput = (e) => {
        this.setState({
            isDropDownOpen: e.target.value,
            inputValue: e.target.value,
            searchedFaqList : ''
        }, () => {
            fetchFaq && clearTimeout(fetchFaq);
            this.getFaqListFromServer();
        })
    };

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.openSearchPage();
        } else if (event.key == ' ' && !this.state.inputValue ){
            event.preventDefault();
        }
    };
    
    openSearchPage = () =>{
        let searchQuery = 'q=' + this.state.inputValue;
            this.props.history.push({
                pathname: '/',
                search: searchQuery,
            })
            this.toggleDropdown();
    }
    openSelectedFaq = (selectedFAQ) => {
        if (selectedFAQ == null) {
            this.props.history.push({
                pathname: '/'
            });
        } else {
            this.props.history.push({
                pathname: '/article/' + CommonUtils.formatFaqQuery(selectedFAQ.name)
            });
        }
    }

    clearSearchBar = () => {
        this.setState({
            inputValue: ""
        })
    }

    componentDidMount = () => {
        this.setState({
            settings: CommonUtils.getItemFromLocalStorage(CommonUtils.getHostNameFromUrl()),
        });
    }
    toggleDropdown = () => {
        this.state.inputValue && this.setState({ 
            isDropDownOpen: !this.state.isDropDownOpen ,
            searchedFaqList : ''
        });
    }
    setPageTitle = () =>{
        document.title = this.state.settings.title + " | Helpcenter";
    }
    componentDidUpdate = (prevProps) => {   
        // Following check will check if the user is moving back from article page or search page it will clear the searchbar and reset the page title to default
        (this.props.location.key !== prevProps.location.key && this.props.location.pathname === '/' && !CommonUtils.getUrlParameter(this.props.location.search,"q")) ? (this.clearSearchBar() , this.setPageTitle()) : false;
    }

  render() {
    return (
     <SearchBoxWrapper
        onBlur={this.toggleDropdown}
        onFocus={this.toggleDropdown} >
         <SearchBox
            placeholder="Search Helpcenter"
            onChange={(e)=>{this.handleInput(e)}}
            value={this.state.inputValue}
            onKeyDown={(e)=>{this.handleKeyPress(e)}} />
         {  
             this.state.inputValue &&
             <ClearButtonWrapper onClick={this.clearSearchBar}>
                <ClearButton/>
             </ClearButtonWrapper>
         }
         {    
            (this.state.searchedFaqList && this.state.isDropDownOpen) &&
                <SearchResultsWrapper className="animated-fast slide-animated">
                    {
                        this.state.searchedFaqList.map((data,index)=>(
                            <SearchResults key={index} onMouseDown={()=>{this.openSelectedFaq(data)}}>{data.name}</SearchResults>
                        ))
                    }
                    {   
                        this.state.totalSearchResults > this.state.maxVisibleSearchedFaq &&
                        <SeeAllButton onMouseDown={this.openSearchPage}>See all results</SeeAllButton> 
                    }
                    {   
                        this.state.searchedFaqList.length == 0  &&
                        <NoResultFoundMenuButton>No results found</NoResultFoundMenuButton> 
                    }
                </SearchResultsWrapper>
         }
     </SearchBoxWrapper>
    );
  }
}
export default withRouter(HelpQuerySearch);
