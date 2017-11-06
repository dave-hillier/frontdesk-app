import * as React from 'react';
import {
  List,
  Grid,
  Cell,
  LinearProgress,
  CircularProgress,
  Button
} from 'react-md';

export class SelectItemLayout<Item> extends React.Component<
  {
    isMobile: boolean,
    hotelSiteCode: string,
    getItems: (code: string) => Promise<Item[]>,
    renderItem: (item: Item, onClickCallback: (x: any) => void) => JSX.Element,
    renderSelectedItem: (item: Item) => JSX.Element
  },
  {
    items: Item[],
    isLoading: boolean,
    selected?: Item
  }> {

  constructor(props: any) {
    super(props);
    this.state = { items: [], isLoading: true };
  }

  componentWillMount() {
    this.props.getItems(this.props.hotelSiteCode).then(items => {
      this.setState({ items: items, isLoading: false });
    });
  }

  render() {
    if (this.state.isLoading) {
      // TODO: animate
      return (
        <div style={{ marginTop: '80px' }}>
          {this.props.isMobile ?
            <CircularProgress id="loading-progress" /> :
            <LinearProgress id="loading-progress" />}
        </div>);
    }

    const list = (
      <List className="md-paper md-paper--1">
        {this.state.items.map(r => this.props.renderItem(r, (x: any) => this.setState({ selected: r })))}
      </List>
    );

    return (
      <div>
        <div className="fab">
          <Button floating={true} secondary={true} primary={true}>share</Button>
        </div>
        {!this.props.isMobile ? (
          <Grid>
            <Cell>{list}</Cell>
            {this.state.selected && <Cell size={8}>
              <div className="md-paper md-paper--1 sticky-top md-list">
                {this.props.renderSelectedItem(this.state.selected)}
              </div>
            </Cell>}
          </Grid>)
          : list}
      </div>);
  }
}