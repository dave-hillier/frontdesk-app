import * as React from 'react';

import { Tooltip } from '../Tooltip';

// TODO: consider IconSeparator
export const People = (props: { adults: number, children: number, infants: number }): JSX.Element => {
  return (
    <div className="align-items-center">
      <Tooltip label="Adults">
        <i className="material-icons medium-icon">person</i>
      </Tooltip>
      &nbsp;{props.adults}&nbsp;&nbsp;
      <Tooltip label="Children">
        <i className="material-icons medium-icon">child_care</i>
      </Tooltip>
      &nbsp;{props.children}&nbsp;&nbsp;
      <Tooltip label="Infants">
        <i className="material-icons medium-icon">child_friendly</i>
      </Tooltip>
      &nbsp;{props.infants}&nbsp;&nbsp;
    </div>
  );
};
