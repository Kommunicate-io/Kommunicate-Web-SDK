import React, { Component } from 'react';
import './Integrations.css';
import { thirdPartyList, modals } from './ThirdPartyList'
import Modal from 'react-responsive-modal';
import IntegrationDescription from './IntegrationDescription.js';
import { getThirdPartyListByApplicationId }  from '../../utils/kommunicateClient'

class Integrations extends Component {
    constructor(props){
        super(props);
        this.state = {
            modalIsOpen: false,      
            activeDiv:-1,
            Helpdocs:false, //enableHelpdocs
            Zendesk:false,  //enableZendesk
            Clearbit:false, //enableClearbit
            helpdocsKeys:[],
            zendeskKeys:[],
            clearbitKeys:[],
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
                return integration.type == 1;
              });
            let zendeskKeys = response.data.message.filter(function (integration) {
                return integration.type == 2;
            });
            let clearbitKeys = response.data.message.filter(function (integration) {
                return integration.type == 3;
            });
            this.setState({
                helpdocsKeys:helpdocsKeys,
                zendeskKeys:zendeskKeys,
                clearbitKeys,clearbitKeys

            })
            if (this.state.helpdocsKeys.length > 0) {

                this.setState({ Helpdocs:true })
            }
            else {

                this.setState({ Helpdocs:false })
            }
            if (this.state.zendeskKeys.length > 0) {

                this.setState({ Zendesk:true })
            }
            else {

                this.setState({ Zendesk:false })
            }
            if (this.state.clearbitKeys.length > 0) {

                this.setState({ Clearbit:true })
            }
            else {

                this.setState({  Clearbit:false}) 
            }
        }).catch(err => {
            console.log("Error while fetching third patry intgration list", err);
        })
        
  
    }
    openModal = (index) => {
        this.setState({ modalIsOpen: true});
    }
    
    closeModal = () => {
        this.setState({ modalIsOpen: false });
    }
    
 render (){
     const thirdParties = thirdPartyList.map((item,index) => {
     var enabledClass = this.state[item.name]?"content-wrapper enable-integration-wrapper":"content-wrapper";
        return <div key={index} className="col-lg-4 col-md-4 ">        
            <div className={enabledClass}>
                <img src={item.logo} className="integration-brand-logo" />
                <h6 className="logo-title">{item.name}</h6>
                <p className="integration-description">{item.subTitle}</p>
                <span className={ item.name == "Zendesk" ? "integration-settings" : "integration-settings not-active" }  onClick={() => {this.setState({activeDiv:index},this.openModal)}}>{item.status}</span>
            </div>
        </div> 
     });
     
     return <div className="row">
        <div className="col-lg-2">
        </div>
        <div className="col-lg-8">
            <div className = "integration-wrapper">
                <h4 className="integration-title">Improve work flow - Use Kommunicte with other services</h4>
            </div>
            <div className="row">
            {thirdParties}
            </div>
        </div>
        <Modal open={this.state.modalIsOpen} onClose={this.closeModal}>
            <div>
                <IntegrationDescription activeModal={this.state.activeDiv} handleCloseModal={this.closeModal} 
                  getThirdPartyList = {this.getThirdPartyList}helpdocsKeys = {this.state.helpdocsKeys} zendeskKeys={this.state.zendeskKeys} clearbitKeys={this.state.clearbitKeys} />
            </div>
        </Modal>
     </div>
     
 }     

}
export default Integrations