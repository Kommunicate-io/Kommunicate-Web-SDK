import React, { Component } from 'react';
// import { hideBanner } from '../actions'
import { connect } from 'react-redux'

class ComponentB extends Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (
      <div>
        <h5>Component B</h5>
        <p>{this.props.isHidden ? "hidden" : "show"}</p>
        <p>{JSON.stringify(this.props.userInfo,0,4)}</p>
      </div>
    )

  }
}
const mapStateToProps = state => ({
  
    isHidden: state.reducerA.isHidden,
    applicationInfo: state.reducerA.applicationInfo,
    userInfo:state.loginReducer.userInfo 
});
const mapDispatchToProps = dispatch => ({}) ;
export default connect(mapStateToProps, mapDispatchToProps)(ComponentB)

