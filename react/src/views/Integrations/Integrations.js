import React, { Component } from 'react';
import './Integrations.css';
import { thirdPartyList, modals } from './ThirdPartyList'
import Modal from 'react-responsive-modal';
import IntegrationDescription from './IntegrationDescription.js';
import { getThirdPartyListByApplicationId }  from '../../utils/kommunicateClient'
import { THIRD_PARTY_INTEGRATION_TYPE }  from '../../utils/Constant'
import CommonUtils from '../../utils/CommonUtils';
import LockBadge from '../../components/LockBadge/LockBadge';
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
                         <span data-key={item.key} className="integration-settings" onClick={this.openModal}>{item.label}</span>
                         <div className={key === 'helpdocs' ? "percent-off-pill vis" : "percent-off-pill n-vis" } hidden={this.state.hideHelpdocsOfferBanner}>{item.discountCouponOff} off</div>
                     </div>
                 </div>);
             }
         }
         return result;
     });
     
     return <div className="animated fadeIn">
     <div className={(CommonUtils.isTrialPlan()) ? "row card-block integration-container" : (CommonUtils.isStartupPlan()) ? "n-vis" : "row card-block integration-container"}>
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
        { this.state.activeDiv !== "agilecrm" &&
            <Modal open={this.state.modalIsOpen} onClose={this.closeModal}>
            <div>
                <IntegrationDescription activeModal={this.state.activeDiv} handleCloseModal={this.closeModal} hideHelpdocsOfferBanner={this.state.hideHelpdocsOfferBanner} 
                  getThirdPartyList = {this.getThirdPartyList} helpdocsKeys = {this.state.helpdocsKeys} zendeskKeys={this.state.zendeskKeys} clearbitKeys={this.state.clearbitKeys} agilecrmKeys={this.state.agilecrmKeys}/>
            </div>
            </Modal>
        }
        
     </div>
     <div className={(CommonUtils.isTrialPlan()) ? "n-vis" : (CommonUtils.isStartupPlan()) ? "upgrade-plan-container" : "n-vis"}>
        <div className="upgrade-plan-heading-container">
            <div className="upgrade-plan-heading">
                <h4>Upgrade your plan to use all integrations</h4> 
                <button className="km-button km-button--primary" onClick={() => this.props.history.push("/settings/billing")}>Upgrade plan</button>
            </div>
        </div>
        
        <div className="upgrade-plan-integrations">
            <h2>What are Integrations?</h2>
            <p className="p">Easily move data between Kommunicate and your other favorite apps. Integrate with your favorite CRM, knowledge base software and other apps.</p>
        </div>
        <div className="upgrade-plan-available-integrations">
            <h2>List of integrations available</h2>
            <div className="upgrade-plan-available-integrations-icons">
                <LockBadge className={"lock-with-text"} text={"Available in Growth Plan"} history={this.props.history} onClickGoTo={"/settings/billing"}/>
                <div className="integrations-icons-container">
                    <div className="integrations-icons helpdocs text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" data-name="Group 15" viewBox="-1011 5277 115.657 115.372">
                            <path d="M-967.693 5277v87.621a4 4 0 0 0 7.153 2.462l6.8-8.708a1 1 0 0 1 1.576 0l6.8 8.708a4 4 0 0 0 7.153-2.462v-87.504a58.514 58.514 0 0 1 42.869 56.638c0 32.374-25.891 58.618-57.829 58.618s-57.829-26.245-57.829-58.618A58.505 58.505 0 0 1-967.693 5277z" fill="#f44599"/>
                            <path d="M-951.971 5344.928a1.321 1.321 0 0 1-1.952-.005 82.587 82.587 0 0 1-6.555-7.595 5.64 5.64 0 0 1 .6-7.9 4.121 4.121 0 0 1 4.673-.376 4.634 4.634 0 0 1 1.862 1.979.433.433 0 0 0 .8 0 4.623 4.623 0 0 1 2.05-2.078 4.081 4.081 0 0 1 3.927.1c2.895 1.691 3.2 6 1.1 8.389a87.179 87.179 0 0 1-6.5 7.482" fillRule="evenodd" fill="#f44599"/>
                        </svg>
                        <p>Helpdocs</p>
                    </div>
                    <div className="integrations-icons zendesk text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" data-name="Group 13" viewBox="-983.58 5154 54.66 41.26">
                            <path d="M-958.33 5154a12.6 12.6 0 0 1-3.726 8.915 12.6 12.6 0 0 1-8.944 3.655 12.6 12.6 0 0 1-12.58-12.57z" fill="#02363d" data-name="Path 2"/>
                            <path d="M-954.17 5195.26a12.63 12.63 0 0 1 25.25 0z" fill="#02363d" data-name="Path 3"/>
                            <path d="M-958.33 5164.9v30.36h-25.25z" fill="#02363d" data-name="Path 4"/>
                            <path d="M-954.17 5154v30.36l25.25-30.36z" fill="#02363d" data-name="Path 5"/>
                        </svg>
                        <p>Zendesk</p>
                    </div>
                    <div className="integrations-icons clearbit text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" data-name="Group 16" viewBox="-873 5277 120 120">
                            <path fill="#5ca4ff" fillRule="evenodd" d="M-813 5277v60h60v-40a20 20 0 0 0-20-20z" opacity=".9"/>
                            <path d="M-873 5337v40a20 20 0 0 0 20 20h40v-60z" fill="#499aff" fillRule="evenodd" />
                            <path fill="#e7f3ff" fillRule="evenodd" d="M-813 5337v60h40a20 20 0 0 0 20-20v-40z"/>
                            <path d="M-873 5297v40h60v-60h-40a20 20 0 0 0-20 20z" fill="#499aff" fillRule="evenodd" />
                        </svg>
                        <p>Clearbit</p>
                    </div>
                    <div className="integrations-icons agile text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48.988 33.681">
                            <path fill="#409ce3" d="M21.271.375a12.994 12.994 0 0 1 6.2 0 14.808 14.808 0 0 1 11 10.6 16.445 16.445 0 0 1 .4 5.4 8.972 8.972 0 0 1 6.2 1.4 8.736 8.736 0 0 1 3.9 7.7c-.1 4.4-4.4 8.3-8.8 8.2h-27.2a13.98 13.98 0 0 1-5-.5 11.781 11.781 0 0 1-7.3-7c-.9-2.1-.7-4.4-.5-6.5a11.777 11.777 0 0 1 10.3-9.6 14.732 14.732 0 0 1 10.8-9.7zm-6.5 10.5c2.9.5 5.4 2.3 8.2 3.5-.5.8-1.2 3-1.6 3.8-1.5-.8-3.1-1.5-4.6-2.4-1.8-.9-3.9-1.6-5.8-1.1-3.6.8-6.7 3.8-6.3 7.5.2 4 4.5 6.8 8.5 6.8h25.5c2.1.1 4.8 0 5.9-1.9.8-1.9 1-4.2-1-6a4.821 4.821 0 0 0-5.5-.5 9.756 9.756 0 0 1-2.3 3.4c-.7-.6-2.7-1.9-3.4-2.4a9.86 9.86 0 0 0 2.4-5.4 10.5 10.5 0 0 0-6.6-11c-5.1-2-11.6.7-13.4 5.7z"/>
                        </svg>
                        <p>Agile CRM</p>
                    </div>
                </div>
                <p className="and-more">and many more coming soon…</p>
            </div>
        </div>
     </div>
     </div>
     
 }     

}
export default Integrations