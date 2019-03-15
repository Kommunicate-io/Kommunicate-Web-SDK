import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { TrialExpiredEmptyState } from '../../assets/svg/svgs';
import Button from '../../components/Buttons/Button';

class TrialExpired extends Component {
    render() {
        return (
            <Container >
                <TrialExpiredEmptyStateContainer>
                    <TrialExpiredEmptyState />
                </TrialExpiredEmptyStateContainer>
                <Text>Your account is suspended as your trial has ended.<br />Please subscribe to a plan to continue using Applozic.</Text>
                <LinkButton as={Link} to='/settings/billing'>See plans</LinkButton>
            </Container>
        );
    }
}

//Styles
const Container = styled.div`
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;
const TrialExpiredEmptyStateContainer = styled.div`
    margin: 25px 0;
`;
const Text = styled.p`
    font-size: 18px;
    line-height: 1.44;
    letter-spacing: 0.5px;
    text-align: center;
    color: #3f3f3f;
    margin-bottom: 30px;
`;
const LinkButton = styled(Button)`
    display: inline-block;
    line-height: 39px;
    text-decoration: none !important;
`;

export default TrialExpired;