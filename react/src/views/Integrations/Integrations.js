import React, { Component } from 'react';
import './Integrations.css';
import { thirdPartyList, modals } from './ThirdPartyList'
import Modal from 'react-responsive-modal';
import IntegrationDescription from './IntegrationDescription.js';
import { getThirdPartyListByApplicationId }  from '../../utils/kommunicateClient'
import { THIRD_PARTY_INTEGRATION_TYPE }  from '../../utils/Constant'
class Integrations extends Component {
    constructor(props){
        super(props);
        this.state = {
            modalIsOpen: false,      
            activeDiv:'zendesk',
            hideHelpdocsOfferBanner: false
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        
    }
    componentDidMount () {
        this.getThirdPartyList();
    }
    getThirdPartyList = () =>{
        let integratedThirdParties={}
        let enable = {};
        for (const key of Object.keys(thirdPartyList)) {
            let thirdParty = thirdPartyList[key];
            let state = thirdParty.state;
            enable[thirdParty.key] = false;
            integratedThirdParties[state] = {};
            this.setState(enable);
            this.setState(integratedThirdParties);
        }
        return Promise.resolve(getThirdPartyListByApplicationId()).then(response =>{
            this.setState({hideHelpdocsOfferBanner: false})
            response.data.message.forEach(element => {
                let type = element.type
                //todo get state variable from third party list. then set it in state.
                for (const key of Object.keys(thirdPartyList)) {
                    // console.log(key, thirdPartyList[key]);
                    let thirdParty = thirdPartyList[key];
                    let integrationType= thirdParty.integrationType;      
                    if (type == integrationType) {
                        let state = thirdParty.state;
                        integratedThirdParties[state]=element;
                        enable[thirdParty.key] = true;
                        if ( thirdParty.key == "helpdocs" ) {
                            this.setState({hideHelpdocsOfferBanner: true})
                        }
                                    
                    }

                }
            
        });
        this.setState(enable);
        this.setState(integratedThirdParties);
        
            
        }).catch(err => {
            console.log("Error while fetching third patry intgration list", err);
        })
        
  
    }
    
    openModal = (event) => {
        this.setState({
            activeDiv:event.target.getAttribute("data-key"),
            modalIsOpen: true
        });
    }
    
    closeModal = () => {
        this.setState({ modalIsOpen: false });
    }
    
 render (){
     const thirdParties = [thirdPartyList].map((party) => {
         var party = thirdPartyList;
         var result = [];
         for (var key in party) {
             var partyKey = key;
             if (party.hasOwnProperty(key)) {
                 var item = party[key];
                 var enabledClass = this.state[item.key] ? "content-wrapper enable-integration-wrapper" : "content-wrapper";
                 result.push(<div key={key} className="col-lg-4 col-md-4 col-lg-4-integration ">
                    <div className ={ enabledClass !== "content-wrapper" ? "active-integrated" : "hide-integrated" }>INTEGRATED</div>
                     <div className={enabledClass}>
                         <img src={item.logo} className="integration-brand-logo" />
                         <h6 className="logo-title">{item.name}</h6>
                         <p className="integration-description">{item.subTitle}</p>
                         <span data-key={item.key} className="integration-settings" onClick={this.openModal}>Settings</span>
                         <div className={key === 'helpdocs' ? "percent-off-pill vis" : "percent-off-pill n-vis" } hidden={this.state.hideHelpdocsOfferBanner}>{item.discountCouponOff} off</div>
                     </div>
                 </div>);
             }
         }
         return result;
     });
     
     return <div className="row card-block integration-container">
        <div className="col-lg-2">
        </div>
        <div className="col-lg-8">
            <div className = "integration-wrapper">
                <h4 className="integration-title">Improve work flow - Use Kommunicate with other services</h4>
            </div>
            <div className="row">
            {thirdParties}
            </div>
        </div>
        <Modal open={this.state.modalIsOpen} onClose={this.closeModal}>
            <div>
                <IntegrationDescription activeModal={this.state.activeDiv} handleCloseModal={this.closeModal} hideHelpdocsOfferBanner={this.state.hideHelpdocsOfferBanner} 
                  getThirdPartyList = {this.getThirdPartyList} helpdocsKeys = {this.state.helpdocsKeys} zendeskKeys={this.state.zendeskKeys} clearbitKeys={this.state.clearbitKeys} agilecrmKeys={this.state.agilecrmKeys}/>
            </div>
        </Modal>
     </div>
     
 }     

}
export default Integrations