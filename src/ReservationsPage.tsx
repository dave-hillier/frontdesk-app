import * as React from 'react';

import { getReservations } from './FakeReservations';
import { Reservation } from './Model';
import { ResidentItem } from './ReservationComponents';
import { SelectItemLayout } from './SelectedItemLayout';
import { ReservationDialog } from './ReservationDialog';
import { ReservationsTable } from './ReservationsTable';
import { ReservationPanel } from './RoomComponents';

import './ReservationsPage.css';

class PageLayout extends SelectItemLayout<Reservation> { }

// TODO: only used for mobile view, get rid of the dependency
export class ReservationsPage extends React.PureComponent<{
  isMobile: boolean,
  hotelSiteCode: string
}>  {

  render() {
    return (
      <PageLayout
        {...this.props}
        title="Reservation"
        getItems={getReservations}
        renderItem={(item: Reservation, onClick: (x: any) => void) => <ResidentItem key={item.ref} reservation={item} onClick={onClick} />}
        renderSelectedItem={i => <ReservationPanel reservation={i} />}
        dialogId="reservation-dialog"
      />);
  }
}

export class ReservationsTablePage extends React.PureComponent<
  {
    isMobile: boolean,
    hotelSiteCode: string
  },
  {
    reservations: Reservation[],
    isLoading: boolean
  }> {
  private dialog: ReservationDialog;

  constructor(props: any) {
    super(props);
    this.state = { reservations: [], isLoading: true };
  }

  componentWillMount() {
    getReservations(this.props.hotelSiteCode).then((reservations: Reservation[]) => {
      reservations.sort((a, b) => a.bookingLines[0].arrival.getTime() - b.bookingLines[0].arrival.getTime());
      this.setState({ reservations });
      // Slight delay to remove loading...
      setTimeout(() => this.setState({ isLoading: false }), 100);
    });
  }

  show(event: any, reservation: Reservation) {
    if (this.dialog) {
      this.dialog.show(event, reservation);
    }
  }

  render() {
    if (this.props.isMobile) {
      return <ReservationsPage {...this.props} />;
    }
    return <ReservationsTable reservations={this.state.reservations} />;
  }
}

export default ReservationsTablePage;