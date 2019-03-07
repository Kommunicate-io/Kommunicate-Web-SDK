import React, { Component } from 'react'
import { CommonUtils } from '../../utils/CommonUtils';

export class Loading extends Component { 
    
  render() {
    return (
      <div>
        <div className="book">
            <div className="book-con">
                <div className="book-list"></div>
                <div className="book-list"></div>
                <div className="book-list"></div>
                <div className="book-list"></div>
                <div className="book-list"></div>
            </div>
	    </div>
        <h1 className="book-loading-text">Loading 'em FAQs</h1>
      </div>
    )
  }
}
