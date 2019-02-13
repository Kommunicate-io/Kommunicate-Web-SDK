import React, { Component } from 'react';
import {BlockButtonContainer, BlockButtonTextWrapper, BlockButtonArrowWrapper, BlockButtonSubTitle, BlockButtonDescription,BlockButtonWrapper} from './GeneralFunctionComponentsStyle'
import {RightArrow} from '../../../src/assets/svg/svgs'

const BlockButton = props => (
    <BlockButtonContainer>
        <BlockButtonTextWrapper>
            <h2>{props.title}</h2>
            <BlockButtonSubTitle>{props.subTitle}</BlockButtonSubTitle>
            <BlockButtonDescription>{props.description}</BlockButtonDescription>
        </BlockButtonTextWrapper>
        <BlockButtonArrowWrapper>
            <RightArrow />
        </BlockButtonArrowWrapper>
        <BlockButtonWrapper data-block-button ={props.name} onClick = {props.onClickOfBlock}/>  
    </BlockButtonContainer> 
)

export {
    BlockButton
}