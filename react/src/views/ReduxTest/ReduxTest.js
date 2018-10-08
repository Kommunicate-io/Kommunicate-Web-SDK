import React from 'react'
// import { hideBanner } from '../actions'
import { connect } from 'react-redux'
import ComponentA from './ComponentA'
import ComponentB from './ComponentB'

const ReduxTest = (props) => (
  <div className="">
    <h2>Redux Test</h2>
    <div className="row">
      <div className="col-lg-6">
        <ComponentA />
      </div>
      <div className="col-lg-6">
        <ComponentB />
      </div>
    </div>
  </div>
)
// const mapStateToProps = state => {
//   return {

//   }
// }
// const mapDispatchToProps = dispatch => {

// }

export default connect()(ReduxTest)

