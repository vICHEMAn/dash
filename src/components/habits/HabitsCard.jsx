import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { DATE_FORMAT } from '../../actions/types';
import {
  toggleHabitConfirmRemove,
  toggleEditHabit } from '../../actions';

class HabitsCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewExtra: false,
    };
  }

  setCompleted(e, id) {
    e.stopPropagation();
    const newCompletedDays = [...this.props.card.completedDays, (moment().format(DATE_FORMAT))];
    this.props.habitsUpdateDaysMutation({
      variables: {
        id,
        completedDays: newCompletedDays,
      },
    });
  }

  viewExtra() {
    if (!this.state.viewExtra) {
      return this.setState({ viewExtra: true });
    }
    return this.setState({ viewExtra: false });
  }

  // calculate streak:
  // if date. -1 === previous array entry => streak count +1, run check again
  // else paste streak, check if streak is < then previous best streak,
  // if it is, update state with new best streak.
  countStreak() {
    const array = this.props.card.completedDays;
    let streakCounter = 0;

    // check if last array item is the day before today
    if (array[array.length - 1] === moment()
          .subtract(1, 'days')
          .format(DATE_FORMAT)) {
      streakCounter += 1;
    } else {
      return streakCounter;
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
      <TransitionGroup exit={false}>
        <CSSTransition
          timeout={500}
          classNames="fade"
          appear
          key="habit-card"
        >
          <div>
            <div
              className="card-body clickable"
              role="button"
              tabIndex={0}
              onClick={() => this.viewExtra()}
            >
              <div className="card-body-row">
                <p className="card-body-title">
                  {this.props.card.name}
                </p>
                <button
                  className="card-body-complete-button"
                  onClick={e => this.setCompleted(e, this.props.card.id)}
                >
                  <p>{this.countStreak()}</p>
                </button>
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
        </CSSTransition>
      </TransitionGroup>
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

HabitsCard.propTypes = {
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
  connect(null, { toggleHabitConfirmRemove, toggleEditHabit })(HabitsCard),
);
