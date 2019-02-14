import styled, { css } from 'styled-components';
import tinycolor from 'tinycolor2';

//Breakpoints for media queries
const sizes = {
    desktop: 992,
    tablet: 768,
    phone: 576,
}

export const StyleUtils = {
    // Iterate through the screen sizes as per breakpoints and create a media query template
    mediaQuery: Object.keys(sizes).reduce((acc, label) => {
        acc[label] = (...args) => css `
        @media (max-width: ${sizes[label] / 16}em) {
            ${css(...args)}
        }
        `

        return acc
    }, {}),

    //function to calculate gradient color
    getGradientColor: (colorCode) => {
        return tinycolor(colorCode).saturate(20).toString()
    }

}

