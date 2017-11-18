import * as React from 'react';
import {
  Button,
  MenuButton,
  List,
  Paper
} from 'react-md';

import './MoreVertButtom.css';

// TODO: transistion up and down
export class MoreVertButton extends React.PureComponent<
  { id: string, icon?: string, bottomSheet?: boolean, children: any }, { bottomSheetVisible: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { bottomSheetVisible: false };
  }
  render() {
    const icon = this.props.icon ? this.props.icon : 'more_vert';

    if (this.props.bottomSheet) {
      return (
        <div>
          {this.state.bottomSheetVisible ?
            <div onClick={() => this.setState({ bottomSheetVisible: false })} className="bottom-sheet-overlay">
              <Paper zDepth={2} className="bottom-sheet-menu"><List>{this.props.children}</List></Paper>
            </div>
            : null}

          <Button id={this.props.id} icon={true} onClick={() => this.setState({ bottomSheetVisible: true })}>{icon}</Button>
        </div>);
    }
    return <MenuButton id={this.props.id} icon={true} menuItems={this.props.children}>{icon}</MenuButton>;
  }
}