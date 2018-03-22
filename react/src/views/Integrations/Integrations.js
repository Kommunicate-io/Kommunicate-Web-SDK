import React, { Component } from 'react';
import './Integrations.css';
import { thirdPartyList, modals } from './ThirdPartyList'
import ClearbitLogo from './images/clearbit.png';
import ZendeskLogo from './images/zendesk.png';
import HelpdocsLogo from './images/helpdocs.png';
import Modal from 'react-modal';
import HelpdocsIntegrationDescription from './HelpdocsIntegrationDescription.js';
import index from 'react-notifications';
const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      overflow: 'hidden',
      height: '450px',
      width: '600px'
  
    }
  };

class Integrations extends Component {
    constructor(props){
        super(props);
        // var modelList = thirdPartyList.map(item=>"<"+item.modal+"/>");
        //var modelList = thirdPartyList.map(item=>item.modal);
        // console.log("modelList",modelList);
        this.state = {
            modalIsOpen: false,
            modals:[<HelpdocsIntegrationDescription/>, "hello",""],          
            activeDiv:-1
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        
    }
    openModal = (index) => {
        // this.createComponent (index)
        this.setState({ modalIsOpen: true});
    }
    
    closeModal = () => {
        this.setState({ modalIsOpen: false });
    }
    // createComponent = (index) => {
    //    let ModalDescription = Components[this.state.modals[index]]
    //    return <ModalDescription/>;
    // }
 render (){
     const thirdParties = thirdPartyList.map((item,index) => {
        return <div key={index} className="col-lg-4 col-md-4">
            <div className="logo-wrapper">
             <img src={item.logo} className="integration-brand-logo" />
                    <h6 className="logo-title">{item.name}</h6>
                    <p className="integration-description">{item.description}</p>
                    <p className="integration-settings" onClick={() => {this.setState({activeDiv:index},this.openModal)}}>{item.setting}</p>
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
            {/* <div className="col-lg-3 col-md-3">
                <div className="logo-wrapper">
                    <img src={HelpdocsLogo} className="integration-brand-logo" />
                    <h6 className="logo-title">Helpdocs</h6>
                    <p className="integration-description">Import your FAQs from Helpdocs</p>
                    <p className="integration-settings" onClick={this.openModal}>Settings</p>
                </div>
            </div> */}
            {/* <div className="col-lg-3 col-md-3">
                <div className="logo-wrapper">
                    <img src={ZendeskLogo} className="integration-brand-logo" />
                    <h6 className="logo-title">Zendesk</h6>
                    <p className="integration-description">Open Zendesk ticket for all conversations</p>
                    <p className="integration-settings">Settings</p>
                </div>
            </div>
            <div className="col-lg-3 col-md-3">
                <div className="logo-wrapper">
                    <img src={ClearbitLogo} className="integration-brand-logo" />
                    <h6 className="logo-title">Clearbit</h6>
                    <p className="integration-description">Get company details of youranonymous visitors</p>
                    <p className="integration-settings">Settings</p>
                </div>
            </div> */}
            </div>
        </div>
         <Modal
             isOpen={this.state.modalIsOpen}
             ariaHideApp={false}
             onRequestClose={this.closeModal}
             style={customStyles}
             contentLabel="Example Modal"
         >
             <div>

                 {/* {ModalDescription = Components[this.state.modals[this.state.activeDiv]]}
                 <ModalDescription/> */}
                 
                 {this.state.modals[this.state.activeDiv]}
                {/* <HelpdocsIntegrationDescription/> */}
             </div>
         </Modal>
     </div>
     
 }     

}
export default Integrations