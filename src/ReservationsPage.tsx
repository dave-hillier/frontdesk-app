import * as React from 'react';
import {
  Collapse,
  Button
} from 'react-md';

import { addDays } from './dateHelpers';
import { getReservations } from './FakeReservations';
import { renderGrid } from './ReservationDialog';
import { ResidentsTopLine, BottomLine, MiddleLine } from './ReservationComponents';
import { Reservation } from './Model';

import './ReservationsPage.css';

class ReservationMain extends React.Component<{ collapsed: boolean, reservation: Reservation, onClick: any }, { collapsed: boolean }> {

  render() {
    const r = this.props.reservation;
    const a = new Date(r.arrival);
    const wide = { width: '100%', minWidth: 200 };

    return (
      <div className="flex-box">
        <div style={wide}>
          <ResidentsTopLine
            name={`${r.profile.firstName} ${r.profile.lastName}`}
            arrival={a}
            departure={new Date(addDays(a, r.nights))}
          />
          <MiddleLine
            roomName={r.allocations[0].name ? 'Room: ' + r.allocations[0].name.toString() : ''}
            roomType={r.allocations[0].type}
            nights={r.nights}
          />
          <BottomLine
            balance={r.balance ? r.balance : 0}
            adults={r.guests.adults}
            children={r.guests.children}
            infants={r.guests.infants}
          />
        </div>
        <div className="align-flex-end">
          {this.props.collapsed ?
            <Button icon={true} onClick={this.props.onClick} >keyboard_arrow_down</Button> :
            <Button icon={true} onClick={this.props.onClick} >keyboard_arrow_up</Button>}
        </div>
      </div>
    );
  }
}

class ReservationsPanel extends React.Component<{ reservation: Reservation }, { collapsed: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { collapsed: true };
  }

  toggle() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    const r = this.props.reservation;
    const paddingTop = {
      paddingTop: '12px'
    };
    const cn = ' md-divider-border md-divider-border--top md-divider-border--bottom md-divider-border--left md-divider-border--right reservation-list-item'
      + (!this.state.collapsed ? ' expanded' : ' collapsed');
    return (

      <div className={cn} onClick={() => this.state.collapsed && this.toggle()}>
        <ReservationMain collapsed={this.state.collapsed} reservation={r} onClick={() => this.toggle()} />
        <Collapse collapsed={this.state.collapsed}>
          <div style={paddingTop}>
            <div className="space-between-content">
              <Button raised={true} primary={true}>Reservation</Button>
              <Button raised={true} primary={true}>Check in</Button>
              <Button raised={true} primary={true}>Deallocate</Button>
              <Button raised={true} primary={true}>Room Billing</Button>
            </div>
            <div>
              {renderGrid(r)}
            </div>

          </div>
        </Collapse>
      </div>);
  }
}

class ReservationsPage extends React.Component<{ isMobile: boolean, hotelSiteCode: string }, { reservations: Reservation[] }> {

  constructor(props: any) {
    super(props);
    this.state = { reservations: [] };
  }

  componentWillMount() {
    getReservations(this.props.hotelSiteCode).then(rez => {
      rez.sort((a: Reservation, b: Reservation) => new Date(a.arrival).getTime() - new Date(b.arrival).getTime());
      rez.splice(100);
      this.setState({ reservations: rez });
    });
  }

  render() {
    const position: 'fixed' = 'fixed';
    const display: 'block' = 'block';
    const fabStyle = {
      position,
      bottom: '16px',
      right: '16px',
      display,
      zIndex: 99
    };

    const cards = this.state.reservations.map(r => <ReservationsPanel reservation={r} key={r.ref} />);
    if (this.props.isMobile) {
      return (
        <div>
          <Button floating={true} secondary={true} style={fabStyle}>add</Button>
          {...cards}
        </div>);
    }
    return (
      <div className="md-grid">
        <Button floating={true} secondary={true} style={fabStyle}>add</Button>
        <div className="md-cell md-cell--12">
          {...cards}
        </div>
      </div >);
  }
}

export default ReservationsPage;