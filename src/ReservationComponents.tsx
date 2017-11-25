import * as React from 'react';

import { ListItem, Button, Divider, FontIcon } from 'react-md';

import { Tooltip } from './Tooltip';
import { addDays } from './dateHelpers';
import { Reservation, BookingLine } from './Model';
import { ProfileShortPanel } from './ProfileComponents';

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
// TODO: consider IconSeparator
export const People = (props: { adults: number, children: number, infants: number }): JSX.Element => {
  return (
    <div className="align-items-center">
      <Tooltip label="Adults">
        <i className="material-icons medium-icon">person</i>
      </Tooltip>
      &nbsp;{props.adults}&nbsp;&nbsp;
      <Tooltip label="Children">
        <i className="material-icons medium-icon">child_care</i>
      </Tooltip>
      &nbsp;{props.children}&nbsp;&nbsp;
      <Tooltip label="Infants">
        <i className="material-icons medium-icon">child_friendly</i>
      </Tooltip>
      &nbsp;{props.infants}&nbsp;&nbsp;
    </div>
  );
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

export const ResidentItem = (props: { booking: BookingLine, onClick: (e: any) => void }): JSX.Element => {
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
// TODO: remove duplicate
const Value = (props: { title: string, children: any }) => {
  return (
    <div className="rd-tile">
      <div className="rd-tile-content">
        <div className="md-tile-text--primary md-text">{props.title}</div>
        <div className="md-tile-text--secondary md-text--secondary">{props.children}</div></div>
    </div>
  );
};

const BookingLineRow = (props: { bookingLine: BookingLine }) => {
  const { bookingLine } = props;
  return (
    <div>
      <div className="rd-grid">
        <div className="rd-row">
          <div className="rd-tile-icon"><FontIcon>date_range</FontIcon></div>
          <Value title={'Arrival'}>{bookingLine.arrival.toLocaleDateString()}</Value>
          <Value title={'Nights'}>{bookingLine.nights}</Value>
          <Value title={'Departure'}>{addDays(bookingLine.arrival, bookingLine.nights).toLocaleDateString()}</Value>
        </div>
        <div className="rd-row">
          <div className="rd-tile-icon"><FontIcon>schedule</FontIcon></div>
          <Value title="ETA">{bookingLine.eta ? bookingLine.eta.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '--:--'}</Value>
          <Value title="ETD">{bookingLine.etd ? bookingLine.etd.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '--:--'}</Value>

          <Value title="Guests"><People adults={1} children={0} infants={0} /></Value>
        </div>
        <div className="rd-row2">
          <div className="rd-tile-icon"><FontIcon>hotel</FontIcon></div>
          <Value title="Room Type">{bookingLine.roomType}</Value>
          <Value title="Allocated Room">{bookingLine.allocatedRoom ? bookingLine.allocatedRoom.name : ''}</Value>
        </div>
        <div>
          <Value title="Rate">{bookingLine.rate}</Value>
        </div>

      </div>
      <Divider />
    </div>);
};

// TODO: more menu should contain the options?
// TODO: Cancel for before today?
// TODO: state on mobile
export const ReservationPanel = (props: { reservation: Reservation }) => {
  const { reservation } = props;

  return (
    <div>
      {reservation.bookingLines.map(bl => <BookingLineRow key={bl.refFull} bookingLine={bl} />)}
      <div className="rd-grid">
        <div className="rd-row2">
          <div className="rd-tile-icon"><FontIcon>pie_chart</FontIcon></div>
          <Value title="Media Source">{reservation.mediaSource}</Value>
          <Value title="Market Segment">{reservation.marketSegment}</Value>
        </div>
        <div className="rd-row2">
          <div />
          <Value title="Status">{reservation.state}</Value>
        </div>
        <div className="rd-row2">
          <div />
          <Value title="Deposit Required">{reservation.depositRequired.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</Value>
          <Value title="Deposit Paid">{reservation.depositPaid.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</Value>
        </div>
        <div className="rd-row2">
          <div />
          <Value title="Total For Stay">{reservation.totalForStay.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</Value>
          <Value title="Balance">{reservation.balance.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</Value>
        </div>
      </div>
      <Divider />
      <div>
        <div className="rd-row">
          <div className="rd-tile">Profile <Button icon={true}>edit</Button></div>
        </div>
        <div className="rd-row">
          <div className="rd-tile"><ProfileShortPanel profile={reservation.contact} /></div>
        </div>
      </div>
    </div >
  );
};
