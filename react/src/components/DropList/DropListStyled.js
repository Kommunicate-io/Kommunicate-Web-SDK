import styled from 'styled-components';

const DropListContainer = styled.div`
    cursor: pointer;
    position: relative;
    z-index: 20;

    &:focus, &:focus-within {
        outline: none;
    }
`;

const DropListControlContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const DropListOptionsContainer = styled.div`
    position: absolute;
    top: 40px;
    right: 0;
    z-index: 10;
    border-radius: 2px;
    box-shadow: 0 2px 3px 2px rgba(104, 102, 102, 0.25);
    background-color: #ffffff;
    padding: 5px 10px;
    width: 250px;
    cursor: default;
`;
const DropListItem = styled.div`
    padding: 15px;
    margin: 0 -10px;
    font-size: 14px;
    letter-spacing: 0.4px;

    &:hover {
        background-color: #efefef;
        cursor: pointer;
    }

    color: ${props => appearanceColors[props.appearance]};
`;

const appearanceColors = {
    'default': "#454548",
    'danger': "#ED222A",
	'success': "#2dd35c",
	'warning': "#deb752"
};

module.exports = {
    DropListContainer,
    DropListControlContainer,
    DropListOptionsContainer,
    DropListItem
}