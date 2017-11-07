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

function trickle(allItems: any[], batchSize: number = 100, interval: number = 50) {
  return (callback: (batch: any[], last: boolean) => void) => {
    const timer = () => {
      // tslint:disable-next-line:no-console
      console.log('tick');

      callback(allItems.splice(0, batchSize), allItems.length === 0);
      if (allItems.length > 0) {
        setTimeout(timer, interval);
      }
    };
    setTimeout(timer, interval);
  };
}

export class SelectItemLayout<Item> extends React.Component<
  {
    isMobile: boolean,
    hotelSiteCode: string,
    title: string,
    getItems: (code: string) => Promise<Item[]>,
    renderItem: (item: Item, onClickCallback: (x: any) => void) => JSX.Element,
    renderSelectedItem: (item: Item) => JSX.Element
  },
  {
    items: Item[],
    isLoading: boolean,
    selected?: Item
  }> {
  dialog: StandardDialog | null;

  constructor(props: any) {
    super(props);
    this.state = { items: [], isLoading: true };
  }

  componentWillMount() {
    this.props.getItems(this.props.hotelSiteCode).then(items => {
      const ticker = trickle(items);
      ticker((batch, last) => {
        this.setState({ items: batch, isLoading: !last });
      });
    });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div style={{ marginTop: '80px' }}>
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

    const selectedPanel = this.state.selected && (
      <Cell size={8}>
        <Card className="md-paper md-paper--1 sticky-top md-list" style={{ padding: '8px' }}>
          {this.props.renderSelectedItem(this.state.selected)}
        </Card>
      </Cell>);

    const mobileLayout = (
      <StandardDialog
        title={this.props.title}
        id="reservation-dialog"
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
        {!this.props.isMobile ? (
          <Grid>
            <Cell>{list}</Cell>
            {selectedPanel}
          </Grid>)
          : <div>
            {mobileLayout}
            {list}
          </div>}
      </div>);
  }
}