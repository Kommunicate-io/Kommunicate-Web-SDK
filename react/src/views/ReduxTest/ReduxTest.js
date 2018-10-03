import React from 'react'
// import { hideBanner } from '../actions'
import { connect } from 'react-redux'

const ReduxTest = (props) => (
  <div> 
      <h2>Redux Test</h2>
  </div>
)
const mapStateToProps = state => {
  return {
   
  }
}
const mapDispatchToProps = dispatch => {
  
}

export default connect(mapStateToProps,mapDispatchToProps) (ReduxTest)

