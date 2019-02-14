import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { StyleUtils } from '../../utils/StyleUtils';

export const Container = styled.div`
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 30px;

    ${StyleUtils.mediaQuery.tablet`
        padding: 0 20px;
    `}
    ${StyleUtils.mediaQuery.phone`
        padding: 0 10px;
    `}
`