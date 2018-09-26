import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import FontAwesome from 'react-fontawesome';
import 'font-awesome/scss/font-awesome.scss';
import {
  toggleHabitConfirmRemove,
  toggleEditHabit } from '../../actions';

import { DATE_FORMAT } from '../../actions/types';

class HabitComplete extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewExtra: false,
    };
  }

  viewExtra() {
    if (!this.state.viewExtra) {
      return this.setState({ viewExtra: true });
    }
    return this.setState({ viewExtra: false });
  }

  undoCompleted(e, id) {
    e.stopPropagation();
    const oldArray = this.props.card.completedDays;
    const toRemove = oldArray.length - 1;
    const newCompletedDays = [...oldArray.slice(0, toRemove), ...oldArray.slice(toRemove + 1)];
    this.props.habitsUpdateDaysMutation({
      variables: {
        id,
        completedDays: newCompletedDays,
      },
    });
  }

  countStreak() {
    const array = this.props.card.completedDays;
    let streakCounter = 0;

    // check if todays date is in the array
    if (array[array.length - 1] === moment().format(DATE_FORMAT)) {
      streakCounter += 1;
    }

    for (let i = array.length - 1; i > 0; i -= 1) {
      const item = moment(array[i]).subtract(1, 'days').format(DATE_FORMAT);
      const prevItem = moment(array[i - 1]).format(DATE_FORMAT);

      // if the next array item is equal to the array item minus one day
      // through moment, the streak is solid
      if (prevItem === item) {
        streakCounter += 1;
      } else {
        break;
      }
    }
    return streakCounter;
  }

  renderExtra() {
    return (
      <div
        className="habit-extra"
        role="button"
        tabIndex={0}
        onClick={() => this.viewExtra()}
      >
        <p>Streak: {this.countStreak()}</p>
        <p>Total: {(this.props.card.completedDays).length}</p>
      </div>
    );
  }

  renderExtraButtons() {
    return (
      <div className="card-body-extra">
        <button
          className="edit-habit button"
          onClick={() => this.props.toggleEditHabit(true, this.props.card)}
        >
          Edit
        </button>
        <button
          className="delete-habit button"
          onClick={() => this.props.toggleHabitConfirmRemove(true, this.props.card.id)}
        >
          Delete
        </button>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="habit-complete-body clickable">
          <div
            className="habit-complete-row"
            role="button"
            tabIndex={0}
            onClick={() => this.viewExtra()}
          >
            <p>{this.props.card.name}</p>
            <FontAwesome
              name="check"
              tag="i"
              onClick={e => this.undoCompleted(e, this.props.card.id)}
            />
          </div>
          <TransitionGroup exit={false}>
            {(this.state.viewExtra)
              ? <CSSTransition
                timeout={500}
                classNames="slide"
                appear
                key="render-extra"
              >
                {this.renderExtra()}
              </CSSTransition>
              : null
            }
          </TransitionGroup>
        </div>
        <TransitionGroup exit={false}>
          {(this.state.viewExtra)
            ? <CSSTransition
              timeout={500}
              classNames="fade"
              appear
              key="render-extra"
            >
              {this.renderExtraButtons()}
            </CSSTransition>
            : null
          }
        </TransitionGroup>
      </div>
    );
  }
}

const HABITS_UPDATEDAYS_MUTATION = gql`
  mutation updateHabitMutation($id: ID!, $completedDays: [String!]) {
    updateHabit(id: $id, completedDays: $completedDays) {
      id
      completedDays
    }
  }
`;

const { func, shape, string, array } = PropTypes;

HabitComplete.propTypes = {
  toggleHabitConfirmRemove: func.isRequired,
  toggleEditHabit: func.isRequired,
  habitsUpdateDaysMutation: func.isRequired,
  card: shape({
    id: string.isRequired,
    name: string.isRequired,
    completedDays: array.isRequired,
  }).isRequired,
};

export default graphql(
  HABITS_UPDATEDAYS_MUTATION,
  { name: 'habitsUpdateDaysMutation' },
)(
  connect(null, { toggleHabitConfirmRemove, toggleEditHabit })(HabitComplete),
);
