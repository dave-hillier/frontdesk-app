import * as React from 'react';
import {
  Grid,
  Cell,
  LinearProgress,
  CircularProgress,
  Button,
  Card
} from 'react-md';

import { StandardDialog } from './StandardDialog';
import { VirtualizedList } from './Virtualized';

export interface SelectItemLayoutProps<Item> {
  isMobile: boolean;
  hotelSiteCode: string;
  title: string;
  getItems: (code: string) => Promise<Item[]>;
  renderItem: (item: Item, onClickCallback: (x: any) => void) => JSX.Element;
  renderSelectedItem: (item: Item) => JSX.Element;
  dialogId: string;
}

export interface SelectItemLayoutState<Item> {
  items: Item[];
  isLoading: boolean;
  selected?: Item;
}

const LoadingProgress = (props: { isMobile: boolean }) => (
  <div className="toolbar-margin">
    {props.isMobile ? <CircularProgress id="loading-progress" /> : <LinearProgress id="loading-progress" />}
  </div>);

export class SelectItemLayout<Item> extends React.Component<SelectItemLayoutProps<Item>, SelectItemLayoutState<Item>> {
  dialog: StandardDialog | null;

  constructor(props: any) {
    super(props);
    this.state = { items: [], isLoading: true };
  }

  componentWillMount() {
    this.props.getItems(this.props.hotelSiteCode).then(items => {
      this.setState({ items: items });
      // Slight delay to remove loading...
      setTimeout(() => this.setState({ isLoading: false }), 100);
    });
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingProgress isMobile={this.props.isMobile} />;
    }

    const selectedItemsList = (
      <VirtualizedList
        rowHeight={60}
        numberOnScreen={20}
        numberBefore={10}
        collection={this.state.items}
        renderItem={(reservation: any) => this.props.renderItem(reservation, (e: any) => {
          this.setState({ selected: reservation });
          if (this.dialog) {
            this.dialog.show(e);
          }
        })}
      />);

    const selected = this.state.selected && this.props.renderSelectedItem(this.state.selected);

    // TODO: does md-toolbar-relative work??
    const selectedPreview = this.state.selected && (
      <Cell size={8}>
        <Card className="md-paper md-paper--1 sticky-top md-list" style={{ padding: '8px' }}>
          {selected}
        </Card>
      </Cell>);

    const mobilePreview = (
      <StandardDialog
        title={this.props.title}
        id={this.props.dialogId}
        {...this.props}
        ref={self => this.dialog = self}
      >
        {selected}
      </StandardDialog>
    );

    return (
      <div>
        <div className="fab">
          <Button floating={true} secondary={true} primary={true}>add</Button>
        </div>
        {!this.props.isMobile ? <Grid><Cell>{selectedItemsList}</Cell>{selectedPreview}</Grid> : <div>{mobilePreview}{selectedItemsList}</div>}
      </div>);
  }
}