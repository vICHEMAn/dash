import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import FontAwesome from 'react-fontawesome';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import moment from 'moment';

import { DATE_FORMAT } from '../../actions/types';
import { toggleNewHabit } from '../../actions';

import HABITS_QUERY from '../../queries/allHabits';

import HabitsCard from './HabitsCard';
import HabitComplete from './HabitComplete';

class HabitsIndex extends Component {

  renderCards() {
    if (this.props.habitsQuery.loading) return null;

    return this.props.habitsQuery.allHabits.map((card, index) => {
      const today = moment().format(DATE_FORMAT);
      return ((card.completedDays.indexOf(today)) === -1)
        ?
          <CSSTransition
            timeout={500}
            classNames="fade"
            appear
            key={`habits-card-${card.id}`}
          >
            <HabitsCard card={card} index={index} key={card.id} />
          </CSSTransition>
        : '';
    });
  }

  renderCompleted() {
    if (this.props.habitsQuery.loading) return null;

    return this.props.habitsQuery.allHabits.map((card, index) => {
      const today = moment().format(DATE_FORMAT);
      // If the array has todays date, it's completed
      return ((card.completedDays.indexOf(today)) !== -1)
      ?
        <CSSTransition
          timeout={500}
          classNames="fade"
          appear
          key={`habits-completed-${card.id}`}
        >
          <HabitComplete card={card} index={index} key={card.id} />
        </CSSTransition>
      : '';
    });
  }

  render() {
    return (
      <div className="widget-body">
        <div className="widget-title">
          <p>HABITS</p>
          <FontAwesome
            name="plus"
            tag="i"
            onClick={() => this.props.toggleNewHabit(true)}
          />
        </div>
        <div className="box-index">
          {(this.props.habitsQuery.loading)
          ?
            <TransitionGroup exit={false}>
              <CSSTransition
                timeout={500}
                classNames="fade"
                appear
                key={'habits-spinner'}
              >
                <div className="habits-spinner">
                  <FontAwesome
                    name="fas fa-spinner fa-spin"
                    tag="i"
                    className="spinner"
                  />
                </div>
              </CSSTransition>
            </TransitionGroup>
          : null
          }
          <TransitionGroup exit={false}>
            {this.renderCards()}
          </TransitionGroup>
          <TransitionGroup exit={false}>
            {this.renderCompleted()}
          </TransitionGroup>
        </div>
      </div>
    );
  }
}

const { arrayOf, shape, string, func, bool } = PropTypes;

HabitsIndex.defaultProps = {
  habitsQuery: {},
};

HabitsIndex.propTypes = {
  habitsQuery: shape({
    allHabits: arrayOf(shape({
      completedDays: arrayOf(string),
      id: string.isRequired,
      name: string.isRequired,
    })),
    loading: bool.isRequired,
    refetch: func.isRequired,
  }),
  toggleNewHabit: func.isRequired,
};

export default graphql(
  HABITS_QUERY, { name: 'habitsQuery' },
)(connect(null, { toggleNewHabit })(HabitsIndex));
