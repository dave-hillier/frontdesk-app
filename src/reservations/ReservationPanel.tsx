import * as React from 'react';

import { Button, Divider, FontIcon } from 'react-md';

import { addDays } from '../util';
import { Reservation, BookingLine } from '../model/Model';
import { ProfileShortPanel } from '../ProfileComponents';
import { People } from './GuestIcons';

const locale = navigator.language;

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
          <Value title="ETA">{bookingLine.eta ? bookingLine.eta.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) : '--:--'}</Value>
          <Value title="ETD">{bookingLine.etd ? bookingLine.etd.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) : '--:--'}</Value>

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
          <Value title="Deposit Required">{reservation.depositRequired.toLocaleString(locale, { style: 'currency', currency: 'GBP' })}</Value>
          <Value title="Deposit Paid">{reservation.depositPaid.toLocaleString(locale, { style: 'currency', currency: 'GBP' })}</Value>
        </div>
        <div className="rd-row2">
          <div />
          <Value title="Total For Stay">{reservation.totalForStay.toLocaleString(locale, { style: 'currency', currency: 'GBP' })}</Value>
          <Value title="Balance">{reservation.balance.toLocaleString(locale, { style: 'currency', currency: 'GBP' })}</Value>
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