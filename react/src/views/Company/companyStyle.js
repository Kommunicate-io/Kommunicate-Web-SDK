import styled  from 'styled-components';

const CompanyInfoContainer =  styled.div`
& > .input-field-title {
  font-size: 17px;
  letter-spacing: 1.3px;
  color: #616366;
}
& input {
    width: 35%;
    border-radius: 4px;
    height: 40px;
    border:1px solid #a1a1a1;
    padding: 16px;
    margin-bottom: 28px;
    color: #4a4a4a;
    font-size: 0.875rem;
}
& input:focus {
    border: solid 1px #5553b7;
    color: #4a4a4a;
    outline:none
}
& input::placeholder  {
    font-size: 14px;
    color: #cacaca;
}
& label {
    font-size: 15px;
    letter-spacing: 0.3px;
    color: #616366;
    margin-right:6px;
}
& > .km-company-btn-wrapper {
    display: flex;
}
& > .km-company-btn-wrapper > .km-company-cancel-btn {
    margin-left: 12px;
}
`
const CompanyRestrictionBannerContainer = styled.div` 
    margin: -25px 0 30px 0px;
`
const CompanyContainer = styled.div`
    max-width:998px;
`
const Divider1 = styled.hr`
    margin-top: 24px;
    margin-bottom: 8px;
`
const Divider2 = styled.hr`
    margin-top: 8px;
    margin-bottom: 0px;
`
export {
    CompanyInfoContainer,
    CompanyRestrictionBannerContainer,
    CompanyContainer,
    Divider1,
    Divider2
}