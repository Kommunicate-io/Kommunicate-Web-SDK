import React, { Component } from 'react';
import './Integrations.css';
import { thirdPartyList, modals } from './ThirdPartyList'
import ClearbitLogo from './images/clearbit.png';
import ZendeskLogo from './images/zendesk.png';
import HelpdocsLogo from './images/helpdocs.png';
import Modal from 'react-responsive-modal';
import IntegrationDescription from './IntegrationDescription.js';
import index from 'react-notifications';

class Integrations extends Component {
    constructor(props){
        super(props);
        this.state = {
            modalIsOpen: false,      
            activeDiv:-1
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);


        
    }
    openModal = (index) => {
        this.setState({ modalIsOpen: true});
    }
    
    closeModal = () => {
        this.setState({ modalIsOpen: false });
    }
    
 render (){
     const thirdParties = thirdPartyList.map((item,index) => {
        return <div key={index} className="col-lg-4 col-md-4 ">
            <div className="content-wrapper">
             <img src={item.logo} className="integration-brand-logo" />
                    <h6 className="logo-title">{item.name}</h6>
                    <p className="integration-description">{item.subTitle}</p>
                    <span className="integration-settings" onClick={() => {this.setState({activeDiv:index},this.openModal)}}>Settings</span>
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
                <IntegrationDescription activeModal={this.state.activeDiv} handleCloseModal={this.closeModal}/>
            </div>
        </Modal>
     </div>
     
 }     

}
export default Integrations