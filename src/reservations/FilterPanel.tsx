import * as React from 'react';
import { FontIcon, Collapse } from 'react-md';

import './ReservationsPage.css';
import { DatePicker } from '../DataPicker';

class DatePickerContainer extends React.PureComponent<{}, { visible: boolean }> {
  constructor(props: any) {
    super(props);

    this.state = { visible: false };
  }

  render() {
    return (
      <Collapse collapsed={!this.state.visible} animate={true}>
        <DatePicker close={() => this.setState({ visible: false })} />
      </Collapse>
    );
  }

  show() {
    this.setState({ visible: true });
  }
}

// TODO: Move into search bar when its wider...
export class FilterPanel extends React.PureComponent<{}, {}> {
  private dialog: DatePickerContainer | null;
  render() {
    return (
      <div>
        <DatePickerContainer ref={d => this.dialog = d} />
        <div className="md-paper md-paper--2 config-paper" onClick={() => this.dialog && this.dialog.show()}>
          <div className="config-paper-cell">
            <FontIcon style={{ color: 'white', marginLeft: '8px' }}> date_range</FontIcon >
            <div className="config-paper-field">Start</div>
            <div className="config-paper-field">End</div>
          </div >
        </div >
      </div>
    );
  }
}