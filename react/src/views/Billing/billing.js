import React, { Component } from 'react';

class Billing extends Component {

    componentDidMount() {
      let subscribeElems = document.getElementsByClassName("chargebee");
      
      for (var i=0, max=subscribeElems.length; i < max; i++) {
        //subscribeElems[i].click();
      }
      
      document.getElementById("checkout").addEventListener("click", function(){
        var cbInstance = window.Chargebee.getInstance();
        console.log(cbInstance);
  
          cbInstance.setCheckoutCallbacks(function(cart) {
              // you can define a custom callbacks based on cart object
              return {
                  loaded: function() {
                      console.log("checkout opened");
                  },
                  close: function() {
                      console.log("checkout closed");
                  },
                  success: function(hostedPageId) {
          
                  },
                  step: function(value) {
                      // value -> which step in checkout
                      console.log(value);
                  }
              }
          });  
      });
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
                                      <a id="checkout" className="chargebee" href="javascript:void(0)" data-cb-type="checkout" data-cb-plan-id="cbdemo_hustle">Subscribe</a>

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