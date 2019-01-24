import React from 'react';
import styled, { css } from 'styled-components'
import CommonUtils from '../../../utils/CommonUtils';
import {patchUserInfo} from '../../../utils/kommunicateClient';
import {SubscribeIcon} from '../../../assets/svg/svgs.js';
import { Redirect,NavLink } from 'react-router-dom';
import Button from '../../../components/Buttons/Button';

const fontStyling = css`
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
`;

const Subscribed = styled.div`
    display: grid;
    height: 100%;
    padding: 90px 10px;
`
const SuccessContainer = styled.div` 
    width: 100%;
    position: relative;
    padding: 25px 10px;
    border: dashed 2px #c5c5c5;
    border-radius: 4px;
    max-width: 600px;
    margin: auto;
    text-align: center;
`
const SubscribeText = styled.h3`
    font-size: 18px;
    color: #383939;
    margin-top: 20px;
    ${fontStyling}
`

const UnsubscribeSubtext = styled.p`
    font-size: 14px;
    color: #747675;
    ${fontStyling}
`
const SubscribeAgain = styled(UnsubscribeSubtext)`
    font-size: 16px;
    text-align: center;
    margin: 50px;
`;
const SubscribeButton = styled(Button)`
    background-color: #2dd35c;
    &:hover, &:active, &:focus {
        background-color: #29af4f;
    }
`;

const getParametersFromUrl = prop => ({
    appId: CommonUtils.getUrlParameter(prop, "appId"),
    email: CommonUtils.getUrlParameter(prop, "email")
});

export const Subscribe = (props) => {
    if (props && props.location.search) {
        let values = getParametersFromUrl(props.location.search);
        patchUserInfo({ emailSubscription: true }, values.email, values.appId);
    }
    return (
        <Subscribed>
            <SuccessContainer>
                <div>
                    <SubscribeIcon />
                </div>
                <SubscribeText>You have subscribed to weekly report emails from <span>Kommunicate</span></SubscribeText>
            </SuccessContainer>
        </Subscribed>
    );
};

export const Unsubscribe = (props) => {
    if (props && props.location.search) {
        let values = getParametersFromUrl(props.location.search);
        patchUserInfo({ emailSubscription: false }, values.email, values.appId);
    }
    return (
        <Subscribed>
            <SuccessContainer>
                <div>
                    <SubscribeIcon />
                </div>
                <SubscribeText>You have unsubscribed from weekly report emails</SubscribeText>
                <UnsubscribeSubtext>You will no longer be receiving weekly report emails <span>from <strong>Kommunicate</strong></span></UnsubscribeSubtext>
            </SuccessContainer>
            <SubscribeAgain>Want to subscribe again?&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<NavLink to={"/subscribe" + props.location.search}><SubscribeButton>Subscribe</SubscribeButton></NavLink></SubscribeAgain>
        </Subscribed>
    );
};
