import React, { Component } from 'react';
import { ThemeProvider } from 'styled-components';
import theme from '../assets/theme/theme';

export default class ThemeWrapper extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        {this.props.children}
      </ThemeProvider>
    )
  }
}