import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';
import { QuotesIcon } from '../../../../assets/svg/svgs_common.js';
import CatchPhraseImage from '../Testimonials/Images/catchPhraseText.png';
 
class Testimonials extends Component {
    render() {
        return (
            <Container>
                <TestimonialContainer>
                    <Testimonial>
                        <TestimonialProfileContainer>
                            <ProfileImage src={this.props.testimonialFace} />
                        </TestimonialProfileContainer>
                        <TestimonialAuthor>{this.props.testimonialAuthor}</TestimonialAuthor>
                        <TestimonialAuthorCompany>{this.props.testimonialCompany}</TestimonialAuthorCompany>
                        <TestimonialText>{this.props.testimonialText}</TestimonialText>

                        <TestimonialQuotesIconContainer>
                            <QuotesIcon color={this.props.theme.primary}/>
                        </TestimonialQuotesIconContainer>
                    </Testimonial>

                    <TestimonialCatchPhrase>
                        <CatchPhraseImg src={CatchPhraseImage} />
                    </TestimonialCatchPhrase>
                </TestimonialContainer>
            </Container>
        );
    }
}


// Styles
const Container = styled.div`
    padding: 75px;
`;
const Testimonial = styled.div`
    position: relative;
    border-radius: 8px;
    box-shadow: 0 11px 25px 0 rgba(74, 74, 74, 0.1);
    background-color: #ffffff;
    max-width: 500px;
    padding: 20px 25px;
`;
const TestimonialContainer = styled.div``;
const TestimonialProfileContainer = styled.div`
    width: 75px;
    height: 75px;
    border-radius: 50%;
    margin: -50px auto 10px;
`;
const ProfileImage = styled.img`
    width: 75px;
    height: 75px;
    border: 3px solid #fff;
    border-radius: 50%;
    object-fit: cover;
`;
const TestimonialAuthor = styled.h4`
    font-size: 20px;
    font-weight: 500;
    text-align: center;
    color: #313131;
`;
const TestimonialAuthorCompany = styled(TestimonialAuthor)`
    font-size: 18px;
    color: #929292;
    margin-bottom: 15px;
`;
const TestimonialText = styled.p`
    font-size: 16px;
    line-height: 1.5;
    text-align: center;
    color: #767272;
`;
const TestimonialQuotesIconContainer = styled.div`
    position: absolute;
    top: -20px;
    left: 10px;
`;
const TestimonialCatchPhrase = styled.div`
    text-align: center;
    margin-top: 25px;
`;
const CatchPhraseImg = styled(ProfileImage)`
    width: 100%;
    height: 35px;
    border-radius: 0;
    object-fit: none;
    border: none;
`;


export default withTheme(Testimonials);