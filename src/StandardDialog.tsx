import * as React from 'react';
import {
  Button,
  DialogContainer,
  Toolbar,
  ListItem,
} from 'react-md';
import { MoreVertButton } from './MoreVertButton';

export class StandardDialog extends React.PureComponent<{ id: string, title: any, isMobile?: boolean, isDesktop?: boolean }, { pageX?: number, pageY?: number, visible: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { visible: false };
  }

  show = (e: any) => {
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
    const width = this.props.isDesktop ? 1024 : (!this.props.isMobile ? 860 : undefined); // min tablet 768
    const height = this.props.isDesktop ? 768 : (!this.props.isMobile ? 600 : undefined);
    return (
      <div>
        <DialogContainer
          id={this.props.id}
          visible={visible}
          pageX={pageX}
          pageY={pageY}
          fullPage={this.props.isMobile}
          onHide={this.hide}
          width={width}
          height={height}
          aria-labelledby={`${this.props.id}-title`}
        >
          <Toolbar
            fixed={true}
            colored={true}
            title={this.props.title}
            titleId={`${this.props.id}-title`}
            actions={<div style={{ display: 'flex', flexDirection: 'row' }}>
              <Button icon={true} onClick={this.hide}>edit</Button>
              <MoreVertButton
                id="dialog-more-button"
                bottomSheet={this.props.isMobile}
              >
                <ListItem key={1} primaryText="Item One" />
                <ListItem key={2} primaryText="Item Two" />
                <ListItem key={3} primaryText="Item Three" />
                <ListItem key={4} primaryText="Item Four" />
              </MoreVertButton>
              <Button icon={true} onClick={this.hide}>close</Button>
            </div>}
          />
          <section className="md-toolbar-relative">
            {this.props.children}
          </section>
        </DialogContainer>
      </div>
    );
  }
}