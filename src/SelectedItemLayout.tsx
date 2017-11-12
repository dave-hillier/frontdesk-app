import * as React from 'react';
import {
  List,
  Grid,
  Cell,
  LinearProgress,
  CircularProgress,
  Button,
  Card
} from 'react-md';
import { StandardDialog } from './StandardDialog';

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
      return (
        <div style={{ marginTop: '75px' }} className="md-toolbar-relative">
          {this.props.isMobile ?
            <CircularProgress id="loading-progress" /> :
            <LinearProgress id="loading-progress" />}
        </div>);
    }

    const list = (
      <List className="md-paper md-paper--1">
        {this.state.items.map(r => this.props.renderItem(r, (e: any) => {
          this.setState({ selected: r });
          if (this.dialog) {
            this.dialog.show(e);
          }
        }))}
      </List>
    );
    // TODO: does md-toolbar-relative work??
    const selectedPanel = this.state.selected && (
      <Cell size={8}>
        <Card className="md-paper md-paper--1 sticky-top md-list" style={{ padding: '8px' }}>
          {this.props.renderSelectedItem(this.state.selected)}
        </Card>
      </Cell>);

    const mobileLayout = (
      <StandardDialog
        title={this.props.title}
        id={this.props.dialogId}
        {...this.props}
        ref={self => this.dialog = self}
      >
        {this.state.selected && this.props.renderSelectedItem(this.state.selected)}
      </StandardDialog>
    );

    return (
      <div>
        <div className="fab">
          <Button floating={true} secondary={true} primary={true}>add</Button>
        </div>
        {!this.props.isMobile ? <Grid><Cell>{list}</Cell>{selectedPanel}</Grid> : <div>{mobileLayout}{list}</div>}
      </div>);
  }
}