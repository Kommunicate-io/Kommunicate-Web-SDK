import React, { Component } from 'react';

class Billing extends Component {

    componentDidMount() {
      let subscribeElems = document.getElementsByClassName("chargebee");
      
      for (var i=0, max=subscribeElems.length; i < max; i++) {
        subscribeElems[i].click();
      }
    }

    render() {
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-block">
                                <div className="download-link-image-container">
                                    <div className="download-link-container">
                                      Your plan details
                                      <a className="chargebee" href="javascript:void(0)" data-cb-type="checkout" data-cb-plan-id="cbdemo_hustle">Subscribe</a>
                                      <a className="chargebee" href="javascript:void(0)" data-cb-type="portal">Manage account</a>
                                  </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Billing;