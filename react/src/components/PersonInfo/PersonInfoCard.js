import React, { Component, Fragment } from 'react';
import './PersonInfo.css'
import ClearBitInfo from './ClearbitInfo'
import { UserMetadata, LastSeenSection, DisplayPseudoIcon, PseudonymModal } from './MetaInfo'
import EditableText from './EditableText';
import {KommunicateUserInfoPanelLoader} from '../../components/EmptyStateLoader/emptyStateLoader.js';
import {MoreInfoLink} from '../../components/MoreInfoLink/MoreInfoLink';
import { UserInfoEmptyStateSvg, MoreIconVertical } from '../../assets/svg/svgs';
import PersonConversationHistory from './PersonConversationHistory';
import Banner from '../../components/Banner';
import DropList, { DropListItems } from '../DropList';
import * as UserStyles from '../../views/Users/UserStyles';
import Button from '../Buttons/Button';
import Modal from '../Modal/Modal';
import ApplozicClient from '../../utils/applozicClient';
import Notification from '../../views/model/Notification';


const UserInfoEmptyState = (props) => {
    return (
        <div className="km-empty-user-info-wrapper">
            <UserInfoEmptyStateSvg/>
            <MoreInfoLink url={"https://docs.kommunicate.io/docs/api-detail#update-user-details"} descriptionLabel={"You can have your user details to show up here"} Linklabel={"Learn how"} />
        </div>
    )
}

class PersonInfoCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            user: this.props.user,
            clearbitData: this.props.user && this.props.user.metadata && this.props.user.metadata.kmClearbitData ? JSON.parse(this.props.user.metadata.kmClearbitData) : null,
            userMetadata: this.props.user && this.props.user.metadata ? this.props.user.metadata : null,
            pseudoUser: false,
            imageLink: "",
            email:"",
            phoneNumber:"",
            modalType: ""
        }
    }
    componentWillReceiveProps(nextProps) {
        this.handleUpdateUser(nextProps.user)
    }
    handleUpdateUser(user) {
        if (user) {
            var metadata = user.metadata || null;
            var clearbitData = user.metadata && user.metadata.kmClearbitData ? JSON.parse(user.metadata.kmClearbitData) : null
            var KM_PSEUDO_USER = user.metadata && user.metadata.KM_PSEUDO_USER ? JSON.parse(user.metadata.KM_PSEUDO_USER) : null
            var imageLink = window.$kmApplozic.fn.applozic("getContactImage", user);
            var showMetadataEmptyState = this.checkForUserInfoEmptyState();
            imageLink = imageLink.replace('km-alpha-contact-image', 'km-alpha-group-contact-image').replace('km-contact-icon', 'km-group-contact-icon');
            this.setState({
                user: user,
                email:user.email,
                displayName :user.userName && user.userName.trim() ? user.userName : user.userId,
                phoneNumber:user.phoneNumber,
                clearbitData: clearbitData,
                userMetadata: metadata,
                pseudoUser: KM_PSEUDO_USER && (KM_PSEUDO_USER.hidden != "true" || KM_PSEUDO_USER.pseudoName == "true" && user.roleType === 3),
                imageLink: imageLink,
                showMetadataEmptyState : showMetadataEmptyState
            })
        }
    }

    onOpenModal = () => {
        this.setState({ modalOpen: true });
    }
    onCloseModal = () => {
        this.setState({ modalOpen: false });
    }
    checkForUserInfoEmptyState = () => {
        if(this.state.user){
            var userMetaInfo;
            this.state.userMetadata && (userMetaInfo = Object.assign({}, this.state.user.metadata));
            userMetaInfo.KM_PSEUDO_USER && delete userMetaInfo.KM_PSEUDO_USER;
            userMetaInfo.kmClearbitData && delete userMetaInfo.kmClearbitData;
            return Object.keys(userMetaInfo).length > 0 ;
        }
        return false;
    }

    openModal = (modalType) => {
        this.setState({
            modalType
        });
    }

    activateDeactivateUser = (userId, isDeactivated) => {
        let params = {
          userId: userId,
          deactivate: !isDeactivated
        }
        ApplozicClient.activateDeactivateUser(params).then(response => {
          if(response && response.status === 200 && response.data.response === 'success') {
            Notification.success("User " + (params.deactivate ? "blocked" : "unblocked" ) + " successfully");
            this.openModal("");
            var currentConversation =  document.querySelector("li.person.active");
            currentConversation && currentConversation.click();
          }
        }).catch(err => {
          console.log(err);
          Notification.info('Something went wrong. Please try again later.');
        })
    }
    
    deleteUser = (userId) => {
        let data = {
          userId: userId
        }
        ApplozicClient.deleteUser(data).then(response => {
          if(response && response.status === 200 && response.data.response === 'success') {
            Notification.success("User deleted successfully");
            this.openModal("");
            var currentConversation =  document.querySelector("li.person.active");
            currentConversation && currentConversation.click();
          }
        }).catch(err => {
          console.log(err);
          Notification.info('Something went wrong. Please try again later.');
        })
    }
  

    render() {


        const DeleteUser = (
            <Fragment>
              <UserStyles.P>This action is irreversible and all the data for this user will be permanently lost. Although, the user can come back to initiate a new conversation with you anytime.</UserStyles.P>
              <UserStyles.P>Are you sure you want to delete this user?</UserStyles.P>
              <UserStyles.ButtonGroup>
                <Button secondary onClick={() => this.openModal("")}>Cancel</Button>
                <Button danger onClick={() => this.deleteUser(this.props.user.userId)}>Delete user</Button>
              </UserStyles.ButtonGroup>
            </Fragment>
        );
      
        const BlockUser = (
            <Fragment>
              <UserStyles.P>This action will block the user from starting any new conversations or continuing existing ones. You can unblock the user at any time.</UserStyles.P>
              <UserStyles.P>Are you sure you want to block this user?</UserStyles.P>
              <UserStyles.ButtonGroup>
                <Button secondary onClick={() => this.openModal("")}>Cancel</Button>
                <Button danger onClick={() => this.activateDeactivateUser(this.props.user.userId, this.props.user.deactivated)}>Block user</Button>
              </UserStyles.ButtonGroup>
            </Fragment>
        );
        const UnBlockUser = (
            <Fragment>
              <UserStyles.P>This action will allow the user to send messages to you again.</UserStyles.P>
              <UserStyles.P>Are you sure you want to unblock this user?</UserStyles.P>
              <UserStyles.ButtonGroup>
                <Button secondary onClick={() => this.openModal("")}>Cancel</Button>
                <Button onClick={() => this.activateDeactivateUser(this.props.user.userId, this.props.user.deactivated)}>Unblock user</Button>
              </UserStyles.ButtonGroup>
            </Fragment>
        );

        const renderModalContent = {
            '': {
              'heading': '',
              'content': ''
            },
            'deleteUser': {
              'heading': "Delete user - " + (this.props.user && (this.props.user.userName || this.props.user.userId)),
              'content': DeleteUser
            },
            'blockUser': {
              'heading': "Block user - " + (this.props.user && (this.props.user.userName || this.props.user.userId)),
              'content': BlockUser
            },
            'unBlockUser': {
              'heading': "Unblock user - " + (this.props.user && (this.props.user.userName || this.props.user.userId)),
              'content': UnBlockUser
            }
        }

        return (
            <div id="km-group-info-tab"
                className="km-group-info-tab km-panel-sm km-panel">
                {
                    this.state.user ?
                <div>
                <div className="panel-content">

                    <div className="km-group-info-drop-list-container">
                        <DropList control={<div className="km-group-info-drop-list-control"><MoreIconVertical /></div>}>
                            <DropListItems onClick={() => this.openModal(this.props.user.deactivated ? "unBlockUser" : "blockUser")}>{this.props.user.deactivated ? "Unblock" : "Block" } user</DropListItems>
                            <DropListItems appearance="danger" onClick={() => this.openModal("deleteUser")}>Delete user</DropListItems>
                        </DropList>
                    </div>

                    <div className="km-box-top">
                        <div className="km-group-icon-sec km-postion-relative">
                            <div id="km-group-info-icon-box"
                                className="km-group-icon-box km-group-info-icon-box km-hover-on">
                                <div className="km-group-icon" dangerouslySetInnerHTML={{ __html: this.state.imageLink }}></div>
                            </div>
                        </div>
                        {
                            this.state.user ?
                                <EditableText style={"km-sidebar-display-name km-truncate"} keyname={this.state.user.userId} reference={"displayName"} value={this.state.displayName}  updateUserInfo = {this.props.updateUserInfo}>
                                {
                                    this.state.pseudoUser ?
                                        <DisplayPseudoIcon onOpenModal={this.onOpenModal} /> : null
                                }</EditableText> : null
                        }

                        {
                            this.state.modalOpen ? <PseudonymModal modalOpen={this.state.modalOpen} onCloseModal={this.onCloseModal} /> : null
                        }

                        {this.props.user && this.props.user.deactivated && <div style={{padding: "0 15px",     margin: "-10px 0 -20px 0"}}><Banner appearance="warning" heading="This user has been blocked" /></div>}

                        <hr className="hr" />
                        <div className="km-display-email-number-wrapper">
                            <div className="km-postion-relative">
                                <p className="">@</p>
                                {
                                    this.state.user ?
                                        <EditableText id ="km-sidebar-user-email" style={this.state.email ?"km-sidebar-user-data-found km-edit":"km-sidebar-user-data-notfound km-edit  km-custom-text-color"} keyname={this.state.user.userId} reference={"email"} value={this.state.user.email} placeholder={"Add Email"} updateUserInfo = {this.props.updateUserInfo} /> : null
                                }
                            </div>
                            <div className="km-postion-relative">
                                <p>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="14" viewBox="0 0 12 14">
                                        <path fill="#686363" fillRule="nonzero" d="M8.33515566 13.38715016c-.05926722-.00832946-.11912954-.01893995-.1798423-.0313181-.72433044-.15252154-1.42626503-.47091322-2.27774871-1.03226124-1.50153202-1.01436369-2.75189609-2.31205273-3.719929-3.85938861l-.00046307-.00061446C1.3837426 7.22173723.86397466 5.99028636.61187513 4.80377854.4862773 4.21186996.38029987 3.50772098.5469947 2.77121015c.08723782-.46695842.34864425-.87135055.75334045-1.15635487L2.33561942.83451216c.60636074-.45717604 1.33570037-.35723769 1.81417846.2492895.14774114.18154096.29022762.37571102.42813376.56337758.06890112.0935513.13821485.18807619.20968376.28290396l.61744193.81924641c.469604.65142567.3703215 1.35785726-.25450303 1.8499775-.18127857.13658208-.3557812.26404499-.5302838.39150789-.1481799.10827262-.29633457.21636566-.44489304.32733183.10639789.37276514.28599585.75636724.5736771 1.22968834.6024601.98579219 1.21545411 1.72201055 1.92827981 2.31605998l.01516317.01330119c.08826528.0821727.19996166.15921504.31820799.240474.03239393.02231508.06478785.04463015.09679734.06707434l.97048089-.73103612c.2994681-.22563053.6334768-.3204217.96573219-.27372625.33225544.04669546.62740205.22972555.85307703.52916007l1.26573083 1.67963472c.47218866.62651871.36846445 1.36455479-.25814961 1.83682991-.11040583.08318392-.2205088.16421292-.32963818.2448294-.21777313.1603857-.42330672.3118708-.62381623.47321778-.44092231.38117707-.98627486.53196492-1.61576413.44349597zM2.77280686 8.0798434c.913921 1.46062416 2.09409806 2.68563972 3.50749335 3.64037227.76851357.50665465 1.39348005.79280436 2.02335274.92545858.48637304.1007671.8618835.0182177 1.1828808-.25895616.22203942-.17901343.44352489-.34235665.6578159-.50011874.1072605-.07904801.2154948-.15850851.32369789-.24035386.31073397-.2341187.34954852-.5102986.11535848-.82081824l-1.26575596-1.6794551c-.21502418-.28530257-.51782556-.32785853-.80316011-.1128768l-1.04486104.78723747c-.08541597.06435566-.3452753.25966173-.68298256.0276175-.06818674-.05041825-.12799042-.09141809-.18758932-.13257223-.13206778-.0910755-.26832263-.18493687-.39352062-.30013397-.7726529-.64530714-1.43247918-1.4366335-2.07605379-2.48954839-.35330624-.58106136-.56403643-1.05199111-.6840576-1.52720247-.0867049-.3526013.11851632-.53965504.2325599-.61353803.17183095-.12930333.34305621-.25429695.5143067-.37947015.17163493-.12530229.34326986-.25060458.51535612-.38042137.31675166-.2495704.35357249-.51156423.1132766-.8450992l-.61281112-.81310207c-.07316686-.0970807-.14435816-.19388374-.21493201-.28986755-.1388323-.18889543-.26997182-.36737072-.40973962-.53918457-.16789546-.2127567-.44141-.40245184-.81118683-.123527l-1.0446562.78708317c-.25998966.18320201-.41482075.42220147-.47016174.71693416-.13830646.6114026-.05063776 1.19431823.06401915 1.73506428.234443 1.10363771.7227653 2.25650656 1.45135088 3.42647847z" />
                                    </svg>
                                </p>
                                {
                                    this.state.user ?
                                        <EditableText id ="km-sidebar-user-number" style={this.state.phoneNumber ?"km-sidebar-user-data-found km-edit":"km-sidebar-user-data-notfound km-edit km-custom-text-color"}  inputType={"number"}  keyname={this.state.user.userId} reference={"phoneNumber"} value={this.state.user.phoneNumber} placeholder={"Add Phone Number"} updateUserInfo = {this.props.updateUserInfo}/> : null
                                }
                            </div>
                        </div>
                    </div>
                    <hr className="km-email-hr"></hr>
                    {/* last seen info */}
                    <LastSeenSection userInfo={this.state.user} />
                    {/* user metadata */}
                    <div id="km-user-info-panel" className="km-sidebar-info-panel">User Info</div>
                    {
                         this.state.showMetadataEmptyState ? 
                        <UserMetadata userInfo={this.state.userMetadata} /> : <UserInfoEmptyState />
                    }
                    {/* user clearbit data */}
                    {this.state.clearbitData ?
                            <ClearBitInfo userDetail={this.state.clearbitData} />: null
                    }
                    {this.props.group ? <PersonConversationHistory user={this.props.user} group={this.props.group} /> : null}
                </div>
            </div> :
            <div className = "km-user-info-panel-loader"> 
                <KommunicateUserInfoPanelLoader/>
            </div>
            }

            <Modal isOpen={this.state.modalType !== ""} heading={renderModalContent[this.state.modalType].heading} onRequestClose={() => this.openModal("")} width="550px">
                {
                    renderModalContent[this.state.modalType].content  
                }
            </Modal>

            </div>
        )
    }
}

export default PersonInfoCard;