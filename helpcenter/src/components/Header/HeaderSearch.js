import React, { Component } from 'react';
import {CommonUtils} from '../../utils/CommonUtils';
import AsyncSelect from 'react-select/lib/Async';
import { withRouter } from 'react-router-dom';
import { ClearButton } from '../../assets/svgAssets';
import { ClearButtonWrapper } from './HeaderComponents'

const customStyles = {
    input: () => ({
        padding: '16px 0',
        maxWidth: '992px',
        overflow: 'hidden',
        cursor: 'text'
    }),
    valueContainer: (provided) =>({
        ...provided,
        paddingLeft:'45px',
        overflow: 'hidden',
        cursor: 'text'
    }),
    singleValue: (provided) =>({
        ...provided,
        maxWidth: 'calc(100% - 44px)',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        opacity: '.8'
    }),
    control: (provided, {isFocused}) => 
    ({ ...provided, 
        border: 'none', 
        boxShadow: 'none'
    }),
    clearIndicator: (provided) =>({
        ...provided,
        height: '70%',
        width: '42px',
        alignItems: 'center',
        marginRight: '10px'
    })
}

const ClearIndicator = (props) => {
    const { children = <ClearButton/>, getStyles, innerProps: { ref, ...restInnerProps } } = props;
    return (
      <ClearButtonWrapper {...restInnerProps} ref={ref} style={getStyles('clearIndicator', props)}>
        {children}
      </ClearButtonWrapper>
    );
  };
  
class HelpQuerySearch extends Component {
    constructor(props){
        super(props);
        this.state = { 
            inputValue: '',
            appId : '',
            searchQuery : '',
            faqList: '',
            searchedFaqList: '',
            isDropDownOpen: false,
            value: '',
            key:''
        };
    }
    getFaqListFromServer = () => {
        var _this = this
        this.state.inputValue && CommonUtils.searchFaq(this.state.appId, this.state.inputValue).then(response=>{
            response && _this.setState({
                searchedFaqList : response.data,
            })
        })
    }
    filterFaqList = (inputValue) => {
        return this.state.searchedFaqList
    };
      
    loadOptions = (inputValue, callback) => {
        this.getFaqListFromServer();
        setTimeout(() => {
            callback(this.filterFaqList());
        }, 1000);
    };
    
    handleInputChange = (newValue,e,q) => {
        this.setState({ isDropDownOpen: newValue })
        this.setState({ inputValue: newValue });
    };
 
    getSelectedFaq = (selectedFAQ)=> {
        this.setState({ inputValue: "null" })
        if(selectedFAQ == null){
            let searchQuery = '?appId='+this.state.appId;
            this.props.history.push({
            pathname: '/',
            search: searchQuery,
        });
        }else{
            let searchQuery = '?appId='+this.state.appId+"&articleId="+selectedFAQ.id;
            this.props.history.push({
            pathname: '/article',
            search: searchQuery,
        });
        }        
    }

    componentDidMount = () => {
        this.setState({
            appId : CommonUtils.getUrlParameter(window.location.search,"appId")
        })
    }
    toggleDropdown = () => {
        this.state.inputValue && this.setState({ isDropDownOpen: !this.state.isDropDownOpen });
    }
    componentDidUpdate = (prevProps) => {
        this.props.location.pathname !== prevProps.location.pathname && !this.state.inputValue && !window.location.pathname.includes("article") ? this.setState({
            key: new Date().getTime()
        }) : false;
    }

  render() {
    return (
      <div>
        <AsyncSelect
          key={this.state.key}
          styles={customStyles}
          menuIsOpen={this.state.isDropDownOpen}
          loadOptions={this.loadOptions}
          noOptionsMessage={ () => "No results found "}
          onInputChange={this.handleInputChange}
          getOptionLabel={({ name }) => name}
          getOptionValue={({ id }) => id}
          onBlurResetsInput={false}
          onCloseResetsInput={false}  
          cacheOptions={false}
          onChange={this.getSelectedFaq}
          blurInputOnSelect={false}
          components={{DropdownIndicator:null,ClearIndicator  }}
          isClearable = {true}
          placeholder="Search Helpcenter"
          filterOptions= {false}
          onBlur={() => this.toggleDropdown()}
          onFocus={()=> this.toggleDropdown()}/>
      </div>
    );
  }
}
// 
export default withRouter(HelpQuerySearch);
