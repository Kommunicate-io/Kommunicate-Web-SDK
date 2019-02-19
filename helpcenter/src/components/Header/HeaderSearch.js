import React, { Component } from 'react';
import {CommonUtils} from '../../utils/CommonUtils';
import AsyncSelect from 'react-select/lib/Async';
import { withRouter } from 'react-router-dom';

const customStyles = {
    input: () => ({
        padding: '16px 0',
        maxWidth: '992px',
        overflow: 'hidden'
    }),
    valueContainer: (provided) =>({
        ...provided,
        paddingLeft:'45px',
        overflow: 'hidden',
    }),
    singleValue: (provided) =>({
        ...provided,
        maxWidth: 'calc(100% - 44px)',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    })
}

class HelpQuerySearch extends Component {
    constructor(props){
        super(props);
        this.state = { 
            inputValue: '',
            appId : '',
            searchQuery : '',
            faqList: '',
            searchedFaqList: '',
            isDropDownOpen: true,
            value: ''
        };
    }
    getFaqListFromServer = () => {
        var _this = this
        this.state.inputValue && CommonUtils.searchFaq(this.state.appId, this.state.inputValue).then(response=>{
            response && _this.setState({
                searchedFaqList : response.data,
            })
        })
        this.closeDropdownOnEmptyInput();
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
    
    handleInputChange = (newValue) => {
        this.setState({ inputValue: newValue });
        this.closeDropdownOnEmptyInput();
    };

    closeDropdownOnEmptyInput = ()=>{
        this.setState({ isDropDownOpen: this.state.inputValue });  
    }

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
        this.closeDropdownOnEmptyInput();
    }

    componentDidMount = () => {
        this.setState({
            appId : CommonUtils.getUrlParameter(window.location.search,"appId")
        })
    }

  render() {
    return (
      <div>
        <AsyncSelect
          key={this.state.faqList}
          styles={customStyles}
          menuIsOpen={this.state.isDropDownOpen}
          loadOptions={this.loadOptions}
          noOptionsMessage={() => null}
          onInputChange={this.handleInputChange}
          getOptionLabel={({ name }) => name}
          getOptionValue={({ id }) => id}
          onBlurResetsInput={false}
          onCloseResetsInput={false}  
          cacheOptions={false}
          onChange={this.getSelectedFaq}
          blurInputOnSelect={false}
          components={{DropdownIndicator:null,clearIndicator:true }}
          isClearable = {true}
          placeholder="Search Helpcenter"
          filterOptions= {false}
        />
      </div>
    );
  }
}

export default withRouter(HelpQuerySearch);
