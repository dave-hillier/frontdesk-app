import * as React from 'react';

import { Reservation, BookingLine } from '../Model';
import { ReservationPreviewDialog } from './ReservationPreviewDialog';

import './ReservationsPage.css';
import { Table } from './Table';
import { FilterPanel } from './FilterPanel';

// TODO: This is the whole page
export class ReservationsTable extends React.PureComponent<{
  bookings: BookingLine[]
}, {}> {
  private dialog: ReservationPreviewDialog;

  show(event: any, reservation: Reservation) {
    if (this.dialog) {
      this.dialog.show(event, reservation);
    }
  }

  render() {
    return (
      <div>
        <FilterPanel />
        <ReservationPreviewDialog ref={(r: ReservationPreviewDialog) => this.dialog = r} isMobile={false} />
        <Table rowHeight={65} bookings={this.props.bookings} onClick={(e, r) => this.show(e, r)} />
      </div >);
  }
}
