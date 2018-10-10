import React, { Component } from 'react'
import './page404.css'
import { Link } from 'react-router-dom'

class Conversation404 extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }


  render() {
    return (
      <div className="conversation-404-container">
        <div className="conversation-404-row">
          <svg xmlns="http://www.w3.org/2000/svg" width="294" height="198" viewBox="0 0 294 198">
            <g fill="none" fillRule="evenodd">
              <path fill="#E7E5E5" fillRule="nonzero" d="M190.78 118.71c-2.12-6.509 1.412-13.508 7.907-15.67l86.678-28.489a12.421 12.421 0 0 0-3.917-24.215 12.108 12.108 0 0 0-3.846.64l-37.606 12.251c-14.002-35.778-47.53-60.15-85.883-62.43C115.76-1.482 79.58 18.747 61.44 52.615L16.07 67.429a12.421 12.421 0 0 0 3.918 24.216 12.108 12.108 0 0 0 3.846-.641L83.661 71.56a12.108 12.108 0 0 1 3.846-.64 12.421 12.421 0 0 1 3.918 24.215l-82.192 27.35a12.421 12.421 0 0 0 3.918 24.215 12.108 12.108 0 0 0 3.846-.64l39.101-12.75c13.63 36.705 47.716 61.844 86.809 64.022 39.093 2.179 75.761-19.016 93.385-53.98l42.236-13.816a12.421 12.421 0 0 0-3.918-24.216 12.108 12.108 0 0 0-3.846.64l-64.314 20.655c-6.51 2.138-13.52-1.4-15.67-7.905z" />
              <circle cx="75.072" cy="146.138" r="4.701" fill="#EA7AE7" fillRule="nonzero" />
              <path fill="#CACACA" fillRule="nonzero" d="M222.796 104.251v-36.78a24.03 24.03 0 0 0-24.031-24.03h-21.858c-13.272 0-24.031 10.76-24.031 24.03 0 13.273 10.759 24.032 24.03 24.032h23.668c1.045.06 2.08.24 3.084.534.838.355 1.626.82 2.343 1.381l14.615 12.037s1.332 1.14 1.802.905c.47-.235.378-2.109.378-2.109z" />
              <path stroke="#4B4A4A" strokeWidth="5" d="M222.796 104.251v-36.78a24.03 24.03 0 0 0-24.031-24.03h-21.858c-13.272 0-24.031 10.76-24.031 24.03 0 13.273 10.759 24.032 24.03 24.032h23.668c1.045.06 2.08.24 3.084.534.838.355 1.626.82 2.343 1.381l14.615 12.037s1.332 1.14 1.802.905c.47-.235.378-2.109.378-2.109z" />
              <path fill="#EEE" fillRule="nonzero" stroke="#4B4A4A" strokeWidth="5" d="M71.034 169.185c.84.414 3.205-1.623 3.205-1.623l26.003-21.41a18.518 18.518 0 0 1 4.167-2.45 24.337 24.337 0 0 1 5.484-.955H152c23.601 0 42.734-19.132 42.734-42.733 0-23.602-19.133-42.734-42.734-42.734h-38.888c-23.601 0-42.734 19.132-42.734 42.734v65.39s-.2 3.347.656 3.781zm79.77-78.83a5.57 5.57 0 0 1 11.103 0v18.376a5.57 5.57 0 0 1-11.104 0V90.356zm-23.796-8.667a5.57 5.57 0 0 1 11.103 0v35.704a5.57 5.57 0 0 1-11.103 0V81.688zm-23.803 8.668a5.57 5.57 0 0 1 11.11 0v18.375a5.57 5.57 0 0 1-11.11 0V90.356z" />
            </g>
          </svg>

          <h5>Sorry, we couldn’t find the conversation you are looking for</h5>
          <p>The URL might be misspelled or the conversation you are looking for is no longer available<br />
            Head over the  <Link className="converastion404-link" to="/conversations">Conversation section</Link> to resume interacting with your users</p>
        </div>
      </div>
    )
  }
}

export default Conversation404;
