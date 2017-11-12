import * as React from 'react';
import { ListItem } from 'react-md';

import { Room, Reservation } from './Model';
import { ProfilePanel } from './ProfileComponents';

export const RoomListItem = (props: { item: Room, onClick: (x: any) => void }) => {
  return (
    <ListItem
      key={props.item.name}
      className="md-divider-border md-divider-border--bottom"
      primaryText={`Room: ${props.item.name} - ${props.item.type}`}
      secondaryText={`Status: ${props.item.occupied ? 'Occupied' : 'Vacant'}\nHouse Keeping: ${props.item.cleaningStatus}`}
      threeLines={true}
      onClick={props.onClick}
    />);
};

export class RoomPanel extends React.PureComponent<{ room: Room }> {
  render() {
    const r = this.props.room;

    return (
      <div>
        <div className="md-tile-content">
          <div className="md-tile-text--primary md-text">Name</div>
          <div className="md-tile-text--secondary md-text--secondary">{r.name}</div>
        </div>
        <div className="md-tile-content">
          <div className="md-tile-text--primary md-text">Type</div>
          <div className="md-tile-text--secondary md-text--secondary">{r.type}</div>
        </div>
        <div className="md-tile-content">
          <div className="md-tile-text--primary md-text">Status</div>
          <div className="md-tile-text--secondary md-text--secondary">{r.occupied ? 'Occupied' : 'Vacant'}</div>
        </div>
        <div className="md-tile-content">
          <div className="md-tile-text--primary md-text">Housekeeping</div>
          <div className="md-tile-text--secondary md-text--secondary">{r.cleaningStatus}</div>
        </div>
      </div>);
  }
}

export class ReservationPanel extends React.PureComponent<{ reservation: Reservation }> {
  render() {
    const r = this.props.reservation;
    const minWidth = '150px';
    return (
      <div className="md-grid">
        <div className="md-cell--5">
          <div className="md-tile-content md-cell md-cell--bottom" style={{ minWidth }}>
            <div className="md-tile-text--primary md-text">Reference</div>
            <div className="md-tile-text--secondary md-text--secondary">{r.ref}</div>
          </div >
          <div className="md-tile-content md-cell md-cell--bottom" style={{ minWidth }}>
            <div className="md-tile-text--primary md-text">Status</div>
            <div className="md-tile-text--secondary md-text--secondary">{r.state}</div>
          </div>
          <div className="md-tile-content md-cell md-cell--bottom" style={{ minWidth }}>
            <div className="md-tile-text--primary md-text">Ledger</div>
            <div className="md-tile-text--secondary md-text--secondary">{r.ledger ? r.ledger.name : ' '}</div>
          </div>
          <div className="md-tile-content md-cell md-cell--bottom" style={{ minWidth }}>
            <div className="md-tile-text--primary md-text">ETA</div>
            <div className="md-tile-text--secondary md-text--secondary">--:--</div>
          </div>
          <div className="md-tile-content md-cell md-cell--bottom" style={{ minWidth }}>
            <div className="md-tile-text--primary md-text">ETD</div>
            <div className="md-tile-text--secondary md-text--secondary">--:--</div>
          </div>
        </div >
        <ProfilePanel profile={r.contact} />
      </div>
    );
  }
}