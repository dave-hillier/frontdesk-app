import * as React from 'react';

import { ListItem } from 'react-md';

import { Tooltip } from '../Tooltip';
import { addDays } from '../util';
import { BookingLine } from '../model/Model';
import { People } from './GuestIcons';

const today = new Date();
today.setHours(0, 0, 0, 0);

function formatDateRange(arrival: Date, departure?: Date) {
  const arrivalShort = arrival ? arrival.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  }) : '';

  const departureShort = departure ? (' - ' + departure.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  })) : '';

  return arrivalShort + departureShort;
}

export const ArrivalTopLine = (props: { name: string, time?: Date }) => DepartureTopLine({ name: props.name, time: props.time, label: 'ETA' });

export const DepartureTopLine = (props: { name: string, time?: Date, label?: string }): JSX.Element => {
  const label = props.label ? props.label : 'ETD';
  const estimated = props.time ? label + ': ' + props.time.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  }) : '';

  return (
    <div className="space-between-content">
      <div>{props.name}</div>
      <div className="md-text--secondary">{estimated}</div>
    </div>)
    ;
};

export const ResidentsTopLine = (props: { name: string, arrival: Date, departure: Date }): JSX.Element => {
  return (
    <div className="space-between-content">
      <div>{props.name}</div>
      <div className="md-text--secondary">{formatDateRange(props.arrival, props.departure)}</div>
    </div>)
    ;
};

export const MiddleLine = ({ roomName, roomType, nights }: { roomName: string; roomType: string; nights?: number; }): JSX.Element => {
  return (
    <div className="space-between-content">
      <div>{roomType} {roomName}</div>
      <div className="md-text--secondary">{nights ? `${nights} nights` : ''}</div>
    </div>);
};

export const BottomLine = (props: { balance: number, adults: number, children: number, infants: number }): JSX.Element => {
  return (
    <div className="space-between-content">
      <People {...props} />
      <Tooltip label="Balance">{props.balance.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</Tooltip>
    </div>);
};

export const ResidentListItem = (props: { booking: BookingLine, onClick: (e: any) => void }): JSX.Element => {
  const b = props.booking;
  const r = b.reservation;
  const a = (b.arrival);
  const room = b.allocatedRoom;

  return (
    <ListItem
      className="md-divider-border md-divider-border--bottom"
      primaryText={(
        <ResidentsTopLine
          name={`${r.contact.firstName} ${r.contact.lastName}`}
          arrival={a}
          departure={addDays(a, b.nights)}
        />)}
      secondaryText={(
        <div>
          <MiddleLine
            roomName={room ? ('Room: ' + room.name) : ''}
            roomType={b.roomType}
            nights={b.nights}
          />
          <BottomLine
            balance={r.balance ? r.balance : 0}
            adults={b.guests.adults}
            children={b.guests.children}
            infants={b.guests.infants}
          />
        </div>)}
      onClick={props.onClick}
    />
  );
};