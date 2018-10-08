import React, { Component } from 'react';
// import { hideBanner } from '../actions'
import { connect } from 'react-redux'
import * as Actions from '../../actions'
import { getApplication } from '../../utils/kommunicateClient';

class ComponentA extends Component {
  constructor(props) {
    super(props)

  }
  componentDidMount() {
    const { applicationInfo } = this.props // const applicationInfo = this.props.applicationInfo
    getApplication()
      .then(result => applicationInfo(result))
    // return Promise.resolve(getApplication().then(result => {
    //   console.log(result);
    //   this.props.applicationInfo(result.data)
    // } ))
  }

  render() {
    return(
      <div> 
      <h5>component A</h5>
      <button type="submit" onClick = { e => {
        e.preventDefault()
        this.props.hideBanner()
       } }  > Hide </button>
    </div>
    )
    
  }
}
const mapStateToProps = state => {
  
}
const mapDispatchToProps = dispatch => {
  return {
    hideBanner: () => dispatch(Actions.hideBanner()),
    applicationInfo: (result) => dispatch(Actions.applicationInfo(result))
  }
}
export default connect(null,mapDispatchToProps) (ComponentA)
