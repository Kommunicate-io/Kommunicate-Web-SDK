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
    var hidden = this.props.isHidden
    return(
      <div> 
      <h5>component A</h5>
      <p>{this.props.isHidden ? "hidden" : "show"}</p>
      <button type="submit" onClick = { e => {
        e.preventDefault()
        this.props.hideBanner(!hidden)
       } }  > Hide </button>
    </div>
    )
    
  }
}
const mapStateToProps = state => ({
  
  isHidden: state.reducerA.isHidden,
});
// const mapStateToProps = state => {
// }
const mapDispatchToProps = dispatch => {
  return {
    hideBanner: (payload) => dispatch(Actions.hideBanner(payload)),
    applicationInfo: (result) => dispatch(Actions.applicationInfo(result))
  }
}
export default connect(mapStateToProps,mapDispatchToProps) (ComponentA)
// export default connect(null,mapDispatchToProps) (ComponentA)
