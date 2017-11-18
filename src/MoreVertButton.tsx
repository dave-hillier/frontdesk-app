import * as React from 'react';
import {
  Button,
  MenuButton
} from 'react-md';

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
          {this.state.bottomSheetVisible ? <div className="bottom-sheet-menu">{this.props.children}</div> : null}
          <Button id={this.props.id} icon={true} >{icon}</Button>
        </div>);
    }
    return <MenuButton id={this.props.id} icon={true} menuItems={this.props.children}>{icon}</MenuButton>;
  }
}