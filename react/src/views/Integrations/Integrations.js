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
            helpdocs:false, //using for enable and disable Helpdocs
            zendesk:false,  //using for enable and disable Zendesk 
            clearbit:false, //using for enable and disable Clearbit
            Agilecrm:false, //usinfg for enable and disable Agile CRM
            helpdocsKeys:[],
            zendeskKeys:[],
            clearbitKeys:[],
            agilecrmKeys:[],
            showDiscountOffer: true
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        
    }
    componentDidMount () {
        this.getThirdPartyList();
    }
    getThirdPartyList = () =>{
        return Promise.resolve(getThirdPartyListByApplicationId()).then(response =>{
            let helpdocsKeys = response.data.message.filter(function (integration) {
                return integration.type == THIRD_PARTY_INTEGRATION_TYPE.HELPDOCS;
            });
            let zendeskKeys = response.data.message.filter(function (integration) {
                return integration.type == THIRD_PARTY_INTEGRATION_TYPE.ZENDESK;
            });
            let clearbitKeys = response.data.message.filter(function (integration) {
                return integration.type == THIRD_PARTY_INTEGRATION_TYPE.CLEARBIT;
            });
            let agilecrmKeys = response.data.message.filter(function (integration) {
                return integration.type == THIRD_PARTY_INTEGRATION_TYPE.AGILE_CRM;
            });
            this.setState({
                helpdocsKeys:helpdocsKeys,
                zendeskKeys:zendeskKeys,
                clearbitKeys,clearbitKeys,
                agilecrmKeys:agilecrmKeys,

            })
            this.state.helpdocsKeys.length && this.setState({ helpdocs: true, showDiscountOffer: true });
            this.state.helpdocsKeys.length == 0 && this.setState({ helpdocs: false, showDiscountOffer: false });

            this.state.zendeskKeys.length && this.setState({ zendesk: true });
            this.state.zendeskKeys.length == 0 && this.setState({ zendesk: false });

            this.state.clearbitKeys.length && this.setState({ clearbit: true });
            this.state.clearbitKeys.length == 0 && this.setState({ clearbit: false });

            this.state.agilecrmKeys.length && this.setState({ agilecrm: true});
            this.state.agilecrmKeys.length == 0 && this.setState({ agilecrm: false})

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
                         <div className={key === 'helpdocs' ? "percent-off-pill vis" : "percent-off-pill n-vis" } hidden={this.state.showDiscountOffer}>{item.discountCouponOff} off</div>
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
                <IntegrationDescription activeModal={this.state.activeDiv} handleCloseModal={this.closeModal} showDiscountOffer={this.state.showDiscountOffer} 
                  getThirdPartyList = {this.getThirdPartyList} helpdocsKeys = {this.state.helpdocsKeys} zendeskKeys={this.state.zendeskKeys} clearbitKeys={this.state.clearbitKeys} agilecrmKeys={this.state.agilecrmKeys}/>
            </div>
        </Modal>
     </div>
     
 }     

}
export default Integrations