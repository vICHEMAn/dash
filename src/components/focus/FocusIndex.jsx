import React, { Component } from 'react';
import FocusCard from './FocusCard';

import '../../stylesheets/_focus.scss';

class FocusIndex extends Component {
  constructor(props) {
    super(props);

    this.renderCards.bind(this);

    this.state = {
      focusCards: [
        {
          focus: 'Learn React.js',
          goal: 'Become a Worldclass developer',
        },
        {
          focus: 'Visualize it daily',
          goal: 'Earn 1 million €',
        },
        {
          focus: 'Open up the ankles',
          goal: 'Get full mobility',
        },
      ],
    };
  }

  renderCards() {
    return this.state.focusCards.map((card, index) =>
      <FocusCard card={card} index={index} />,
    );
  }

  render() {
    return (
      <div className="box-body">
        <div className="box-title">
          <p>FOCUS</p>
        </div>
        <div className="box-index">
          {this.renderCards()}
        </div>
      </div>
    );
  }
}

export default FocusIndex;
