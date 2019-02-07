import React, { Component } from 'react';
import {CommonUtils} from '../../utils/CommonUtils';
import AsyncSelect from 'react-select/lib/Async';
import { withRouter } from 'react-router-dom';
import { isAbsolute } from 'path';

const customStyles = {
    input: () => ({
        padding: '8px 0',
    }),
    };

class HelpQuerySearch extends Component {
    constructor(props){
        super(props);
        this.state = { 
            inputValue: '',
            appID : '',
            searchQuery : '',
            faqList: '',
            searchedFaqList: '',
            isDropDownOpen: false
        };
    }
    componentWillMount = () => {
        this.setState({
            appID : CommonUtils.getUrlParameter(window.location.search,"appID")
        })
    }
    getSearchResults = (inputValue) => {
        this.state.inputValue && CommonUtils.searchFaq(this.state.appID, this.state.inputValue).then(response=>{
            response && this.setState({
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
        const inputValue = newValue.replace(/\W/g, '');
        this.setState({ inputValue: inputValue });
        this.closeDropdownOnEmptyInput();
        return inputValue;
    };

    closeDropdownOnEmptyInput = ()=>{
        this.state.inputValue == "" ? this.setState({ isDropDownOpen: false }) : this.setState({ isDropDownOpen: true }) ;  
    }

    getSelectedFaq = (x)=> {
        this.setState({ isDropDownOpen: false })
        // this.props.history.push("/article?appID="+this.state.appID);
        console.log(this)
    }

  render() {
    return (
      <div>
        <AsyncSelect
          styles={customStyles}
          menuIsOpen={this.state.isDropDownOpen}
          loadOptions={this.loadOptions}
          noOptionsMessage={()=>"Search Helpcenter"}
          onInputChange={this.handleInputChange}
          getOptionLabel={({ name }) => name}
          getOptionValue={({ id }) => id}
          onBlurResetsInput={true}
          onCloseResetsInput={true}  
          cacheOptions={false}
          onChange={this.getSelectedFaq}
          arrowRenderer={()=>{false}}
          blurInputOnSelect={false}
          components={{DropdownIndicator:null,clearIndicator:true}}
          isClearable = {true}
          placeholder="Search Helpcenter"
        />
      </div>
    );
  }
}

export default withRouter(HelpQuerySearch);
