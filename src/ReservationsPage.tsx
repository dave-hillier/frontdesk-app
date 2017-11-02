import * as React from 'react';
import {
  Collapse,
  Button
} from 'react-md';

import { addDays } from './dateHelpers';
import { ReservationData, getReservations } from './FakeReservations';
import { ResidentsTopLine, BottomLine, MiddleLine } from './ReservationComponents';

import './ReservationsPage.css';

class ReservationMain extends React.Component<{ collapsed: boolean, reservation: ReservationData, onClick: any }, { collapsed: boolean }> {

  render() {
    const r = this.props.reservation;
    const a = new Date(r.arrival);
    const wide = { width: '100%' };

    return (
      <div onClick={this.props.onClick} className="flex-box">
        <div style={wide}>
          <ResidentsTopLine
            name={`${r.firstName} ${r.lastName}`}
            arrival={a}
            departure={new Date(addDays(a, r.nights))}
          />
          <MiddleLine
            roomName={r.roomName() ? 'Room: ' + r.roomName().toString() : ''}
            roomType={r.roomType}
            nights={r.nights}
          />
          <BottomLine
            balance={r.balance ? r.balance : 0}
            adults={r.adults}
            children={r.children}
            infants={r.infants}
          />
        </div>
        <div className="align-flex-end">
          {this.props.collapsed ? <Button icon={true}>keyboard_arrow_down</Button> : <Button icon={true}>keyboard_arrow_up</Button>}
        </div>
      </div>
    );
  }
}

class ReservationsPanel extends React.Component<{ reservation: ReservationData }, { collapsed: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { collapsed: true };
  }

  toggle() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    const r = this.props.reservation;
    const style = {
      padding: '10px'
    };
    return (
      <div style={style} className="md-divider-border md-divider-border--bottom">
        <ReservationMain collapsed={this.state.collapsed} reservation={r} onClick={() => this.toggle()} />
        <Collapse collapsed={this.state.collapsed}>
          <div>
            <div>
              <p>
                Contact Information:
            </p>
              <p>
                Line1<br />
                Line2<br />
                Line3<br />
                Line4<br />
                Line5<br />
              </p>
            </div>
            <div className="space-between-content">
              <Button raised={true} primary={true}>Reservation</Button>
              <Button raised={true} primary={true}>Check in</Button>
              <Button raised={true} primary={true}>Deallocate</Button>
              <Button raised={true} primary={true}>Room Billing</Button>
            </div>
          </div>
        </Collapse>
      </div>);
  }
}

class ReservationsPage extends React.Component<{ isMobile: boolean }, { reservations: ReservationData[] }> {

  constructor(props: any) {
    super(props);
    this.state = { reservations: [] };
  }

  componentWillMount() {
    getReservations('').then(rez => {
      rez.sort((a: ReservationData, b: ReservationData) => new Date(a.arrival).getTime() - new Date(b.arrival).getTime());
      rez.splice(100);
      this.setState({ reservations: rez });
    });
  }

  render() {
    const cards = this.state.reservations.map(r => <ReservationsPanel reservation={r} key={r.ref} />);
    return (
      <div>
        {...cards}
      </div >);
  }
}

export default ReservationsPage;