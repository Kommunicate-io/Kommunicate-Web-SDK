import React, { Component } from 'react';
import {BlockButtonContainer, BlockButtonTextWrapper, BlockButtonArrowWrapper} from './GeneralFunctionComponentsStyle'
import {RightArrow} from '../../../src/assets/svg/svgs'

const BlockButton = props => (
    <BlockButtonContainer onClick = {props.onClickOfBlock}>
        <BlockButtonTextWrapper>
            <h2>{props.title}</h2>
            <p>{props.subTitle}</p>
        </BlockButtonTextWrapper>
        <BlockButtonArrowWrapper>
            <RightArrow />
        </BlockButtonArrowWrapper>  
    </BlockButtonContainer> 
)

export {
    BlockButton
}