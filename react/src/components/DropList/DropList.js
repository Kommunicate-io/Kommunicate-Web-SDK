import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as DropListStyles from './DropListStyled';

class DropList extends Component {

    state = {
        isOpen: false
    };

    showDropDown = (e) => {
        this.setState({ isOpen: true }, () => {
          document.addEventListener('click', this.hideDropDown);
        });
    }

    hideDropDown = (e) => {
        if (!this.dropdownMenu.contains(e.target)) {
            this.setState({ isOpen: false }, () => {
              document.removeEventListener('click', this.hideDropDown);
            });  
        }
    }

    render() {

        const { children, control } = this.props;

        return (
            <DropListStyles.DropListContainer onClick={() => this.showDropDown()} tabIndex="0">

                <DropListStyles.DropListControlContainer>
                    {control}
                </DropListStyles.DropListControlContainer>

                { this.state.isOpen &&
                    <DropListStyles.DropListOptionsContainer ref={(element) => { this.dropdownMenu = element; }}>
                        {children}
                    </DropListStyles.DropListOptionsContainer>
                }
            </DropListStyles.DropListContainer>
        );
    }
}

DropList.propTypes = {
    control: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired
}

export default DropList;