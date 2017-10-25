import * as React from 'react';
import {
  Button,
  DialogContainer,
  Divider,
  TextField,
  Toolbar,
} from 'react-md';

export class ReservationDialog extends React.Component<{ isMobile: boolean }, { pageX?: number, pageY?: number, visible: boolean }> {
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
    // TODO: full page for mobile
    return (
      <div>
        <DialogContainer
          id="simple-full-page-dialog"
          visible={visible}
          pageX={pageX}
          pageY={pageY}
          fullPage={this.props.isMobile}
          onHide={this.hide}
          aria-labelledby="simple-full-page-dialog-title"
        >
          <Toolbar
            fixed={true}
            colored={true}
            title="New Event"
            titleId="simple-full-page-dialog-title"
            nav={<Button icon={true} onClick={this.hide}>close</Button>}
            actions={<Button flat={true} onClick={this.hide}>Save</Button>}
          />
          <section className="md-toolbar-relative">
            <TextField id="event-email" placeholder="Email" block={true} paddedBlock={true} />
            <Divider />
            <TextField id="event-name" placeholder="Event name" block={true} paddedBlock={true} />
            <Divider />
            <TextField id="event-desc" placeholder="Description" block={true} paddedBlock={true} rows={4} />
          </section>
        </DialogContainer>
      </div>
    );
  }
}