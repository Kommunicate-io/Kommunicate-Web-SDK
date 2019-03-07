import styled, {css}  from 'styled-components';

const borderBottom = css`
    border-bottom: 1px solid #c3bfbf;
`
const inputFieldFontSize = css`
    font-size:14px;
`
const inputFieldStyle = css`
    border-radius: 4px;
    padding: 9px;
    margin-bottom: 28px;
    color: #4a4a4a;
`
const inputFieldOnFocus = css`
    border: solid 1px ${props => props.theme.primary};
    color: #4a4a4a;
    outline:none
`
const inputFieldPlaceHolderColour = css`
    color: #cacaca;
`

const CompanyInfoContainer =  styled.div`
 ${borderBottom}

 padding-bottom: 24px;

& > .input-field-title {
  font-size: 18px;
  letter-spacing: 1.3px;
  color: #625f5f;
}
& input {
    ${inputFieldFontSize}
    ${inputFieldStyle}
    border: 1px solid #a1a1a1;
    width: 35%;
}
& input:focus {
    ${inputFieldOnFocus}
}
& input::placeholder  {
    ${inputFieldFontSize}
    ${inputFieldPlaceHolderColour}
}
& > .km-company-btn-wrapper {
    display: flex;
}
& > .km-company-btn-wrapper > .km-company-cancel-btn {
    margin-left: 12px;
}
`
const CompanyBlockButtonContainer = styled.div`
    ${borderBottom}
    padding: 8px 0px 8px 0px;
    position: relative;

    & .lock-badge-container {
        position: absolute;
        left: 230px;
        top: 20px;
        z-index: 1000;    
    }
`
const CompanyRestrictionBannerContainer = styled.div` 
    margin: 0 0 30px 0px;
`
const CompanyContainer = styled.div`
    max-width:998px;
    margin-left: 15px;
`
const CompanyModalTitleContainer= styled.div`

    & > p {
        font-size: 20px;
        font-weight: 500;
        letter-spacing: 0.3px;
        color: #6c6a6a;
    }

    & > hr {
        border-color: #d8d8d8;
        margin-left: -20px;
        margin-right: -20px;
    }
`
const CompanyModalFooterContainer = styled.div`
    text-align: right;
    & button:last-child {
        margin-left: 16px;
    }
`
const CustomUrlStep1InputFieldContainer =styled.div`
    display: flex;
    margin-top: 40px;
    & input {
        ${inputFieldFontSize}
        ${inputFieldStyle}
        border: 1px solid #cecbcb;
        width: 75%;
    }
    & input:focus {
        ${inputFieldOnFocus}
    }
    & input::placeholder  {
        ${inputFieldFontSize}
        ${inputFieldPlaceHolderColour}
    }
    & > p {$
        ${inputFieldFontSize}
        margin-top: 10px;
        margin-right: 8px;
        letter-spacing: 0.5px;
        color: #212122;
    }

`
const SetUpYourDomainContainer = styled.div`
    & > ol {
        padding-left: 15px;
    }
    & ol li {
        ${inputFieldFontSize}
        line-height: 1.43;
        letter-spacing: 0.4px;
        color: #49494a;
        margin-bottom: 20px;
    }
    & ol li span {
        ${inputFieldFontSize}
        color: #000000;
    }
    & ol li span:last-child {
        ${inputFieldFontSize}
        font-style: italic;
        color: #88888b;
    }
    & p:last-child {
        margin-left: 16px;
    }
`
const DomainTable = styled.table`
    width: 95%;
    margin-left: 16px;
    margin-bottom: 34px;
    & th, td {
        padding-left: 10px;
    }
    & tr td {
        font-size: 15px;
        font-style: italic;
        line-height: 1.33;
        letter-spacing: 0.5px;
        color: #49494a;
        max-width: 150px;
        white-space: pre-line;
        word-break: break-word;
    }
    & tr:first-child {
        border: 1px solid #e8e8e8;
        height: 32px;
        border-radius: 1px;
        background-color: #e8e8e8;
        height: 32px;
    }
    & tr:last-child {
        border-bottom: 1px solid rgba(151, 151, 151, 0.3);
        height: 46px;
    }
    & td:last-child span {
        font-size: 14px;
        font-weight: 300;
        color: #8b8c8e;
    }
    & td:last-child span:hover {
        cursor: pointer;
    }
`  
const SetUpCompleteContainer = styled.div`
    text-align: center;
    & svg {
        margin: 34px 0px 28px 0px;
        width: 94.2px;
        height: 94.2px;
    }
    & h5 {
        font-size: 20px;
        letter-spacing: 0.7px;
        color: #424243;
    }
    & p {
        font-size: 16px;
        font-weight: 300;
        letter-spacing: 0.6px;
        text-align: center;
        color: #474444;
    }
`

export {
    CompanyInfoContainer,
    CompanyRestrictionBannerContainer,
    CompanyContainer,
    CompanyBlockButtonContainer,
    CompanyModalTitleContainer,
    CompanyModalFooterContainer,
    CustomUrlStep1InputFieldContainer,
    SetUpYourDomainContainer,
    DomainTable,
    SetUpCompleteContainer
}