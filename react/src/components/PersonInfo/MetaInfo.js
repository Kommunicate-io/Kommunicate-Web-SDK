import React from 'react';
import Labels from '../../utils/Labels';
import { PseudoNameImage } from '../../views/Faq/LizSVG';
import ReactModal from 'react-modal';
import { CSSTransitionGroup } from 'react-transition-group';
import Linkify from 'react-linkify';
import ReactTooltip from 'react-tooltip';
import { InfoIcon } from '../../assets/svg/svgs';

const infoText = Labels["lastcontacted.tooltip"];



export const LastSeenSection = (props) => {
    var user = props.userInfo;
    var lastSeenAtText = "";
    var style = "";
    var lastMessageAt = ""
    if (user && user.connected) {
        lastSeenAtText = window.KM_LABELS["online.now"];
        style = "km-lastseen-online";
    } else if (user && user.lastSeenAtTime) {
        window.$kmApplozic.fn.applozic("getLastSeenAtStatus", {
            "lastseenTime": user.lastSeenAtTime, "dateFormat": "fullYearDateFormat", callback: function (resp) {
                lastSeenAtText = resp.includes(window.KM_LABELS["last.seen.on"]) ? resp.split(window.KM_LABELS["last.seen.on"]) : resp.split(window.KM_LABELS["last.seen"]);
                style = "";
            }
        });
    }

    if (user && user.messagePxy && user.messagePxy.createdAtTime) {
        window.$kmApplozic.fn.applozic("getLastSeenAtStatus",
            {
                "lastseenTime": user.messagePxy.createdAtTime,
                "dateFormat": "fullYearDateFormat",
                callback: function (resp) {
                    lastMessageAt = resp.includes("Last seen on ") ?
                        resp.split("Last seen on ") :
                        resp.split("Last seen ");
                }
            });
    }
    return (
        <div className="km-user-lastseen-info">
            <p className="km-user-info-metadata">
                <span className="km-user-info-meatadata-key">
                    Last seen</span>
                <span className={"km-user-info-meatadata-value km-lastseen " + style}>{lastSeenAtText}</span>
            </p>
            <p className="km-user-info-metadata">
                <span className="km-user-info-meatadata-key">Last contacted
                <span className="km-tooltipsvg">
                        <InfoIcon data-tip={infoText} data-effect="solid" data-html={true} data-place="right" currentitem="false" />
                    </span>
                </span>
                <span className="km-user-info-meatadata-value km-lastMessageAtTime">{lastMessageAt}</span>
            </p>
            <ReactTooltip />
            <p className="km-user-info-metadata">
                <span className="km-user-info-meatadata-key">Conversation<br/>started</span>
                <span className="km-user-info-meatadata-value"></span>
            </p>
        </div>
    )
}
/**
 * 
 * @param {Object} props 
 * accept props.userInfo that contains object.
 * it will iterate all keys and value and display them.
 */
export const UserMetadata = (props) => {
    const userMetaInfo = []
    Object.keys(props.userInfo).forEach(function (key, i) {
        if (key !== "kmClearbitData" && key !== "KM_PSEUDO_USER") {
            userMetaInfo.push(<p key={key + i} className="km-user-info-metadata">
                <span className="km-user-info-meatadata-key">{key}</span>
                <span className="km-user-info-meatadata-value">{props.userInfo[key]}</span>
            </p>
            )
        }
    });
    return (
        <div id="km-sidebar-user-info-wrapper">
            <div id="km-user-info-metadata-wrapper" className="km-user-info-metadata-wrapper">
                <CSSTransitionGroup
                    transitionName="fade"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    <Linkify properties={{target: '_blank'}}>
                    {userMetaInfo}
                    </Linkify>
                </CSSTransitionGroup>
            </div>
        </div>
    )
}

/**
 * This function will render pseudo icon
 * @param {Object} props 
 * @param {function} props.onOpenModal onclick open model
 * 
 */
export const DisplayPseudoIcon = (props) => {
    return (
        <div className="pseudo-name-icon text-center" id="pseudo-name-icon" onClick={props.onOpenModal}>
            <svg xmlns="http://www.w3.org/2000/svg" id="Incognito_Copy_3" data-name="Incognito Copy 3"
                viewBox="0 0 15.433 13.883" height="16px" width="16px">
                <path id="Shape" d="M7.75 0A12.3 12.3 0 0 0 0 2.83h15.433A12.128 12.128 0 0 0 7.75 0z"
                    transform="translate(0 5.998)" fill="#42b9e8" />
                <path id="Shape-2" d="M9.3 5.257A2.564 2.564 0 0 1 6.739 2.7v-.2A2.946 2.946 0 0 0 5.7 2.289a2.355 2.355 0 0 0-.573.07v.269A2.561 2.561 0 1 1 2.561.068a2.58 2.58 0 0 1 2.426 1.617 3.734 3.734 0 0 1 .824-.094 3.641 3.641 0 0 1 1.063.162A2.556 2.556 0 0 1 9.3 0a2.634 2.634 0 0 1 2.561 2.7A2.564 2.564 0 0 1 9.3 5.257zm0-4.515a1.936 1.936 0 0 0-1.887 1.886A1.889 1.889 0 0 0 9.3 4.515a1.937 1.937 0 0 0 1.887-1.887A1.936 1.936 0 0 0 9.3.742zm-6.739 0A1.936 1.936 0 0 0 .674 2.628a1.887 1.887 0 1 0 3.774 0 2.066 2.066 0 0 0-.135-.741A1.859 1.859 0 0 0 2.561.742z"
                    data-name="Shape" transform="translate(1.954 8.626)"
                    fill="#42b9e8" />
                <path id="Shape-3" d="M8.289 0L3.707.741 1.483 0 0 4.515h9.772z"
                    data-name="Shape" transform="translate(2.965)" fill="#42b9e8" />
            </svg>
        </div>
    )
}
/**
 * 
 * @param {Object} props 
 * PseudonymModal
 */
export const PseudonymModal = (props) => {
    const customStyles = {
        content: {
            top: '80px',
            // left                  : '50%',
            // right                 : 'auto',
            bottom: '80px',
            // marginRight           : '-50%',
            // transform             : 'translate(-50%, -50%)'
            maxWidth: '1000px',
            margin: '0 auto',
            overflowY: 'auto'
        }
    };
    return (
        <ReactModal isOpen={props.modalOpen} style={customStyles} shouldCloseOnOverlayClick={true} ariaHideApp={false}>
            <div className="row" style={{ marginTop: "80px" }}>
                <div className="col-lg-5 col-md-6 col-sm-12 pseudo-name-intro-text-container">
                    <p className="intro text-center">Introducing</p>
                    <h1 className="pseudo text-center">PSEUDONYMS</h1>
                    <p className="anonymous text-center">for your anonymous visitors</p>
                    <p className="desc">Pseudonyms help identify anonymous visitors easily when they initiate a conversation and facilitates a better cross team collaboration.<br /><br />Look out for the <span><svg xmlns="http://www.w3.org/2000/svg" id="Incognito_Copy_3" data-name="Incognito Copy 3" viewBox="0 0 15.433 13.883"><path id="Shape" d="M7.75 0A12.3 12.3 0 0 0 0 2.83h15.433A12.128 12.128 0 0 0 7.75 0z" transform="translate(0 5.998)" fill="#42b9e8" /><path id="Shape-2" d="M9.3 5.257A2.564 2.564 0 0 1 6.739 2.7v-.2A2.946 2.946 0 0 0 5.7 2.289a2.355 2.355 0 0 0-.573.07v.269A2.561 2.561 0 1 1 2.561.068a2.58 2.58 0 0 1 2.426 1.617 3.734 3.734 0 0 1 .824-.094 3.641 3.641 0 0 1 1.063.162A2.556 2.556 0 0 1 9.3 0a2.634 2.634 0 0 1 2.561 2.7A2.564 2.564 0 0 1 9.3 5.257zm0-4.515a1.936 1.936 0 0 0-1.887 1.886A1.889 1.889 0 0 0 9.3 4.515a1.937 1.937 0 0 0 1.887-1.887A1.936 1.936 0 0 0 9.3.742zm-6.739 0A1.936 1.936 0 0 0 .674 2.628a1.887 1.887 0 1 0 3.774 0 2.066 2.066 0 0 0-.135-.741A1.859 1.859 0 0 0 2.561.742z" data-name="Shape" transform="translate(1.954 8.626)" fill="#42b9e8" /><path id="Shape-3" d="M8.289 0L3.707.741 1.483 0 0 4.515h9.772z" data-name="Shape" transform="translate(2.965)" fill="#42b9e8" /></svg></span> icon in the conversation screen to identify visitors with pseudonyms.</p>
                    <button className="km-button km-button--primary" onClick={props.onCloseModal}>Cool! Got it</button>
                </div>
                <div className="col-lg-7 col-md-6 col-sm-12 pseudo-name-intro-svg-container">
                    <PseudoNameImage />
                </div>
            </div>
            <div className="close-button-container" onClick={props.onCloseModal}>
                <button className="close-btn"><svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="24" viewBox="0 0 24 24" width="24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg></button>
            </div>
        </ReactModal>
    )
}