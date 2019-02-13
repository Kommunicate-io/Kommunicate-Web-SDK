import styled, {css}  from 'styled-components';

const borderBottom = css`
    border-bottom: 1px solid #c3bfbf;
`
const inputFieldFontSize = css`
    font-size:14px;
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
    width: 35%;
    border-radius: 4px;
    height: 40px;
    border:1px solid #a1a1a1;
    padding: 16px;
    margin-bottom: 28px;
    color: #4a4a4a;
}
& input:focus {
    border: solid 1px #5553b7;
    color: #4a4a4a;
    outline:none
}
& input::placeholder  {
    ${inputFieldFontSize}
    color: #cacaca;
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
`
const CompanyRestrictionBannerContainer = styled.div` 
    margin: -25px 0 30px 0px;
`
const CompanyContainer = styled.div`
    max-width:998px;
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

export {
    CompanyInfoContainer,
    CompanyRestrictionBannerContainer,
    CompanyContainer,
    CompanyBlockButtonContainer,
    CompanyModalTitleContainer,
    CompanyModalFooterContainer
}