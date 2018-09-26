import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import query from '../../queries/allHabits';

import { toggleHabitConfirmRemove } from '../../actions';

// Passar delete action

const HabitConfirmRemove = (props) => {
  function onYes() {
    props.habitsRemoveMutation({
      variables: { id: props.id },
      refetchQueries: [{ query }],
    });
    props.toggleHabitConfirmRemove(false);
  }

  function onNo() {
    props.toggleHabitConfirmRemove(false);
  }

  return (
    <div
      className="opacity-background"
      role="button"
      tabIndex={0}
      onClick={() => props.toggleHabitConfirmRemove(false)}
    >
      <div
        role="presentation"
        className="widget-body opacity-content"
        onClick={e => e.stopPropagation()}
      >
        <div className="widget-title">
          <p>Are you sure?</p>
        </div>
        <div className="box-form-body">
          <p className="remove-confirm-p">The data will be incinerated with a
          flamethrower. There are no redos.</p>
          <div className="box-form-button-row">
            <button className="button" onClick={() => onNo()}>NO</button>
            <button className="button" onClick={() => onYes()}>YES</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const HABITS_REMOVE_MUTATION = gql`
  mutation deleteHabitMutation($id: ID!) {
    deleteHabit(id: $id) {
      id
    }
  }
`;

const { string, func } = PropTypes;

HabitConfirmRemove.propTypes = {
  id: string.isRequired,
  toggleHabitConfirmRemove: func.isRequired,
  habitsRemoveMutation: func.isRequired,
};

export default graphql(
  HABITS_REMOVE_MUTATION, { name: 'habitsRemoveMutation' },
)(connect(null, {
  toggleHabitConfirmRemove,
})(HabitConfirmRemove));
