import React from 'react';
import styled, {css} from 'styled-components';
import Button from '../../components/Buttons/Button';
import checkmark from './img/checkmark2.svg';

const AlBillingPlansTables = (props) => {

    let isEnterprisePlan = props.className.includes("enterprise");

    return (
        <PricingTables className={props.className}>
            <PricingTableContainer>
                <PricingTableHeader>
                    <PlanBriefContainer>
                        <PlanBriefText>
                            {props.briefText}
                        </PlanBriefText>
                    </PlanBriefContainer>
                    <PricingPlanTitle>
                        {props.planTitle} Plan
                    </PricingPlanTitle>
                    <PricingPlanSubTitle>

                    </PricingPlanSubTitle>
                    <PricingValueContainer>
                        <PricingValue>
                            <sup>$</sup>
                            {isEnterprisePlan ? "CUSTOM PRICING" : props.planAmount.amount}
                        </PricingValue>
                        <PricingDuration>
                            per month
                        </PricingDuration>
                        <PricingBillingCycle visibility={props.billingCycleText}>
                            (Billed {props.billingCycleText})
                        </PricingBillingCycle>
                        <MAUText>
                            { isEnterprisePlan ? <p><strong>{props.mauText} </strong>Monthly Active Users</p> : <p>Upto <strong>{props.mauText}</strong> Monthly Active Users</p>}
                        </MAUText>
                    </PricingValueContainer>
                </PricingTableHeader>
                <PricingTableBody>
                    {
                        isEnterprisePlan ? <Button as={"a"} href="https://calendly.com/applozic/pricing-plan/" target="_blank" secondary>Contact Us</Button> : ( props.disabled > 0 ? <Button primary={props.primaryButton} secondary={!props.primaryButton} disabled>Choose Plan</Button> : <Button primary={props.primaryButton} secondary={!props.primaryButton} data-plan-amount={props.billingCycleText === "Annually" ? props.planAmount.amount  * 1200 : props.billingCycleText === "Quarterly" ? props.planAmount.amount  * 300 : props.planAmount.amount  * 100} data-pricing-package={props.planAmount.pricingPackage} onClick={props.buyPlan}>Choose Plan</Button>)
                    }
                    
                </PricingTableBody>
                <PricingTableFooter>
                    <Button secondary link onClick={props.togglePlanDetails}>See plan details</Button>
                    <PricingPlanDetailsListContainer hidden={props.hidePlanDetails}>
                        <EverythingText visibility={props.everythingText}>Everything in <strong>{props.everythingText}</strong> plus</EverythingText>
                        <ul>
                            { props.planDetails ? props.planDetails.map( (items, index) => 
                                <li key={index}>{items}</li>
                            ) : "" }
                        </ul>
                    </PricingPlanDetailsListContainer>
                </PricingTableFooter>
            </PricingTableContainer>
        </PricingTables>
    );
};


// Pricing Tables Styles
const PricingTableContainer = styled.div`
    padding: 15px 9px 25px;
    border-radius: 3px;
    background-color: #fcfcfc;
    text-align: center;
`;
const PricingTableHeader = styled.div``;
const PricingTableBody = styled(PricingTableHeader)`
    & button, & a {
        text-transform: uppercase;
    }
    & a {
        display: inline-block;
        line-height: 39px;
        text-decoration: none !important;
    }
`;
const PricingPlanDetailsListContainer = styled.div``;
const EverythingText = styled.p`
    font-style: italic;
    visibility: ${prop => prop.visibility.length !== 0 ? "visible" : "hidden"};
`;
const PricingTableFooter = styled(PricingTableHeader)`
    & ul {
        text-align: left;
        margin: 20px 0px;
        padding: 0;
        list-style-image: url(${checkmark});
        min-height: 384px;
    }
    & ul li {
        margin-left: 25px;
        line-height: 25px;
        margin-bottom: 12px;
    }
`;
const PlanBriefContainer = styled.div``;
const PlanBriefText = styled.span`
    border-radius: 2px;
    background-color: #ccf8e4;
    font-size: 13px;
    font-weight: 300;
    letter-spacing: 0.6px;
    color: #282928;
    padding: 3px 10px;
`;
const PricingPlanTitle = styled.h4`
    margin-top: 25px;
    font-size: 20px;
    font-weight: 500;
    letter-spacing: 0.9px;
    color: #554d56;
`;
const PricingPlanSubTitle = styled.p``;
const PricingValueContainer = styled.div`
    margin-top: 45px;
`;
const PricingValue = styled.h2`
    font-size: 38px;
    font-weight: 600;
    line-height: 0.47;
    letter-spacing: 2px;
    text-align: center;
    color: #4a4a4a;

    & sup {
        font-size: 18px;
        top: -14px;
        font-weight: normal;
    }
`;
const PricingDuration = styled.p`
    margin: 20px 0 0;
`;
const PricingBillingCycle = styled(PricingDuration)`
    visibility: ${prop => prop.visibility === "Monthly" ? "hidden" : "visible"};
    margin-top: 5px;
    margin-bottom: 15px;
`;
const MAUText = styled.div`

`;
const PricingTables = styled.div`
    position: relative;
    margin-bottom: 30px;

    &.al-enterprise-plan ${PricingValueContainer} {
        margin-top: 25px;
    }
    &.al-enterprise-plan ${PricingValue} {
        font-size: 22px;
        line-height: 1.38;
    }
    &.al-enterprise-plan sup {
        display: none;
    }
    &.al-enterprise-plan ${PricingDuration} {
        visibility: hidden;
    }
    &.al-enterprise-plan ${PricingBillingCycle} {
        margin-bottom: -8px;
    }
`;

export default AlBillingPlansTables;