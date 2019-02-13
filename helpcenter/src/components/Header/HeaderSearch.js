import React, { Component } from 'react';
import {CommonUtils} from '../../utils/CommonUtils';
import AsyncSelect from 'react-select/lib/Async';
import { withRouter } from 'react-router-dom';

const customStyles = {
    input: () => ({
        padding: '12px 0',
        maxWidth: '952px',
        overflow: 'hidden'
    }),
    valueContainer: () =>({
        paddingLeft:'40px',
        overflow: 'hidden'
    })
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
            isDropDownOpen: true,
            value: ''
        };
    }

    getSearchResults = (inputValue) => {
        var _this = this
        this.state.inputValue && CommonUtils.searchFaq(this.state.appId, this.state.inputValue).then(response=>{
            response && _this.setState({
                searchedFaqList : response.data,
            })
        })
        this.closeDropdownOnEmptyInput();
        return this.state.searchedFaqList
    };
      
    loadOptions = (inputValue, callback) => {
        setTimeout(() => {
            callback(this.getSearchResults());
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
          handleOnChange={this.handleSearchbarChange}
        />
      </div>
    );
  }
}

export default withRouter(HelpQuerySearch);
