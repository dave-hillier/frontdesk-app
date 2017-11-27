import * as React from 'react';

import { getBookingLines } from '../FakeReservations';
import { BookingLine, Reservation } from '../Model';
import { ResidentItem, ReservationPanel } from './ReservationComponents';
import { SelectItemLayout } from '../SelectedItemLayout';
import { ReservationPreviewDialog } from './ReservationPreviewDialog';
import * as Fuse from 'fuse.js';

import './ReservationsPage.css';
import { DialogContainer, Toolbar, Button } from 'react-md';
import { ReservationsTable } from './FullPage';

class PageLayout extends SelectItemLayout<BookingLine> { }

class CreateReservationDialog extends React.PureComponent<{}, {
  visible: boolean, pageX?: number, pageY?: number
}> {
  constructor(props: any) {
    super(props);
    this.state = { visible: false };
  }

  show = (e: any) => {
    // provide a pageX/pageY to the dialog when making visible to make the
    // dialog "appear" from that x/y coordinate
    let { pageX, pageY } = e;
    if (e.changedTouches) {
      pageX = e.changedTouches[0].pageX;
      pageY = e.changedTouches[0].pageY;
    }

    this.setState({ visible: true, pageX, pageY });
  }

  hide = () => {
    this.setState({ visible: false });
  }

  render() {
    const { visible, pageX, pageY } = this.state;

    return (
      <div>
        <DialogContainer
          id="create-reservation-dialog"
          visible={visible}
          pageX={pageX}
          pageY={pageY}
          fullPage={true}
          onHide={this.hide}
          aria-labelledby="create-reservation-dialogtitle"
        >
          <Toolbar
            fixed={true}
            colored={true}
            title="Create"
            titleId="create-reservation-dialog-title"
            nav={<Button icon={true} onClick={this.hide}>close</Button>}
          />

        </DialogContainer>
      </div>
    );
  }
}

const FabButton = (props: any) => (
  <div className="fab">
    <Button floating={true} secondary={true} primary={true} {...props}>add</Button>
  </div>
);

// TODO: only used for mobile view, get rid of the dependency
export class MobileReservationsPage extends React.PureComponent<{
  isMobile: boolean,
  hotelSiteCode: string
}>  {
  private dialog: CreateReservationDialog | null;

  render() {
    return (
      <div>
        <CreateReservationDialog ref={el => this.dialog = el} />
        <FabButton onClick={(e: any) => this.dialog && this.dialog.show(e)} />
        <PageLayout
          {...this.props}
          title="Reservation"
          getItems={getBookingLines}
          renderItem={(item: BookingLine, onClick: (x: any) => void) => <ResidentItem key={item.refFull} booking={item} onClick={onClick} />}
          renderSelectedItem={i => <ReservationPanel reservation={i.reservation} />}
          dialogId="reservation-dialog"
        />
      </div >);
  }
}

const fuseOptions = {
  shouldSort: true,
  threshold: 0.2,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    'contact.firstName',
    'contact.lastName',
    'ref',
    'ledger.name'
  ]
};

export class ReservationsTablePage extends React.PureComponent<
  {
    isMobile: boolean,
    hotelSiteCode: string,
    filter: string
  },
  {
    bookings: BookingLine[],
    isLoading: boolean
  }> {
  private dialog: ReservationPreviewDialog;

  constructor(props: any) {
    super(props);
    this.state = { bookings: [], isLoading: true };
  }

  componentWillMount() {
    getBookingLines(this.props.hotelSiteCode).then((bookings: BookingLine[]) => {
      // TODO: needs helper
      bookings.sort((a, b) => a.arrival.getTime() - b.arrival.getTime());
      this.setState({ bookings });
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
      return <MobileReservationsPage {...this.props} />;
    }

    const fuse = new Fuse(this.state.bookings, fuseOptions);
    const filtered: BookingLine[] = this.props.filter !== '' ? fuse.search(this.props.filter) : this.state.bookings;
    return <ReservationsTable bookings={filtered} />;
  }
}

export default ReservationsTablePage;