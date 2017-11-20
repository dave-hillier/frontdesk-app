
import * as React from 'react';
import { List, ListItem } from 'react-md';

export class Virtualized<Item> extends
  React.PureComponent<
  {
    numberBefore: number,
    numberOnScreen: number,
    rowHeight: number,
    collection: Item[],
    renderItem: (i: Item) => JSX.Element,
  },
  { scrollPosition: number }> {

  constructor(props: any) {
    super(props);
    this.state = { scrollPosition: 0 };
  }

  componentWillMount() {
    window.addEventListener('scroll', this.listenScrollEvent);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.listenScrollEvent);
  }

  window(count: number, numberBefore: number, numberOnScreen: number) {
    let endIndex = this.state.scrollPosition + numberOnScreen;
    if (endIndex > count) {
      endIndex = count;
    }

    let startIndex = this.state.scrollPosition - numberBefore;
    if (startIndex < 0) {
      startIndex = 0;
    }

    if (startIndex > endIndex - numberOnScreen) {
      startIndex = endIndex - numberOnScreen;
    }

    return { startIndex, endIndex };
  }

  render() {
    const { rowHeight, collection, renderItem, numberBefore, numberOnScreen } = this.props;
    const { startIndex, endIndex } = this.window(collection.length, numberBefore, numberOnScreen);
    const itemsToShow = collection.slice(startIndex, endIndex);

    return (
      <div>
        <div style={{ height: startIndex * rowHeight }} />
        {itemsToShow.map(item => renderItem(item))}
        <div style={{ height: (collection.length - endIndex) * rowHeight }} />
      </div>);
  }

  private listenScrollEvent = (e: any) => {
    if (document.scrollingElement) {
      const offsetFromTop = document.scrollingElement.scrollTop;
      const scrollPosition = Math.floor(offsetFromTop / this.props.rowHeight); // Deliberately quantized so its not rendering on every sroll
      this.setState({ scrollPosition });
    }
  }
}

export class VirtualizedList<Item> extends Virtualized<Item> {
  render() {
    const { rowHeight, collection, renderItem, numberBefore, numberOnScreen } = this.props;
    const { startIndex, endIndex } = this.window(collection.length, numberBefore, numberOnScreen);
    const itemsToShow = collection.slice(startIndex, endIndex);

    return (
      <List className="md-paper md-paper--1">
        <ListItem style={{ height: startIndex * rowHeight }} primaryText={''} />
        {itemsToShow.map(item => renderItem(item))}
        <ListItem style={{ height: (collection.length - endIndex) * rowHeight }} primaryText={''} />
      </List>);
  }
}