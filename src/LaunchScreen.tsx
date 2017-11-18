import * as React from 'react';

const logo = require('./logo.svg');
import './LaunchScreen.css';

// TODO consider CSS Transistion
export default class LaunchScreen extends React.Component<{ show: boolean }, {}> {
  render() {
    return (
      <div className={'launch-overlay ' + (this.props.show ? 'show' : 'hide')}>
        <div className={'centered-logo'}>
          <img src={logo} width="192px" alt="logo" />
        </div>
        <h1>Guestline</h1>
      </div>
    );
  }
}
