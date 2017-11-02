import * as React from 'react';

// TODO: inject tooltip didnt work...
const Tooltip = (props: { label: React.ReactNode, children: any }) => {
  return (
    <div className="tooltip-container">
      <span className="md-tooltip md-tooltip--top-active">{props.label}</span>
      {props.children}
    </div>
  );
};

export default Tooltip;