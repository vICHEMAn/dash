import React from 'react';

const FocusCard = props => (
  <div className="card-body">
    <div className="card-body-row">
      <div className="card-circle">
        <p>{props.index + 1}</p>
      </div>
      <div className="card-body-focus">
        <p>{props.card.focus}</p>
      </div>
    </div>
    <div className="card-body-row">
      <p className="card-body-title">{props.card.goal}</p>
    </div>
  </div>
);

export default FocusCard;
