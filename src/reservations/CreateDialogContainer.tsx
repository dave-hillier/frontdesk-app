import * as React from 'react';
import './ReservationsPage.css';
import { DialogContainer, Toolbar, Button } from 'react-md';

export class CreateDialogContainer extends React.PureComponent<{}, {
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
