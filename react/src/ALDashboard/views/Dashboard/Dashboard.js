import React , { Component, Fragment } from 'react';
import styled from 'styled-components';
import { TotalUsersIcon, ActiveUsersIcon, ConversationThreadsIcon, MessagesSentIcon } from '../../../assets/svg/svgs';


const Container = styled.div`
    width: 90%;
    margin: 0 auto 50px;
`;

const H2 = styled.h3`
    font-weight: 400;
    letter-spacing: 0.7px;
    color: #2f2f31;
`;

const AnalyticsCardsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const AnalyticsCards = styled.div`
    width: 200px;
    border-radius: 4px;
    box-shadow: 0 2px 5px 0 rgba(172, 170, 170, 0.5);
    background-color: #ffffff;

    & svg {
        width: 40px;
        height: 40px;
    }

    
`;


export default class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    };

    render() {
        return (
            <Fragment>
                <Container className="animated fadein">
                    <H2>Analytics overview for July, 2018</H2>

                    <AnalyticsCardsContainer>
                        <AnalyticsCards>
                            <TotalUsersIcon />
                            
                        </AnalyticsCards>
                    </AnalyticsCardsContainer>
                </Container>
            </Fragment>
        );
    }
}