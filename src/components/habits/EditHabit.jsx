import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { toggleEditHabit } from '../../actions';

class EditHabit extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(values) {
    this.props.habitsUpdateMutation({
      variables: {
        id: this.props.card.id,
        name: values.habit,
      },
    });

    this.props.toggleEditHabit(false);
  }

  renderField(field) {
    return (
      <div className="form-field">
        <label htmlFor={field.label}>{field.label}</label>
        <input
          id={field.label}
          type="text"
          placeholder="Name me"
          {...field.input}
        />
        <p>{field.meta.touched ? field.meta.error : ''}</p>
      </div>
    );
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <div
        className="opacity-background"
        role="button"
        tabIndex={0}
        onClick={() => this.props.toggleEditHabit(false)}
      >
        <div
          role="presentation"
          className="widget-body opacity-content"
          onClick={e => e.stopPropagation()}
        >
          <div className="widget-title">
            <p>EDIT HABIT</p>
          </div>
          <div className="box-form-body">
            <form onSubmit={handleSubmit(this.onSubmit)}>
              <Field
                label="Habit name"
                name="habit"
                component={this.renderField}
              />
              <div className="box-form-button-row">
                <button
                  type="button"
                  className="button"
                  onClick={() => this.props.toggleEditHabit(false)}
                >Close</button>
                <button type="submit" className="button">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};

  if (!values.habit) {
    errors.habit = 'Enter a Habit name';
  }

  return errors;
}

const HABITS_UPDATE_MUTATION = gql`
  mutation updateHabitMutation($id: ID!, $name: String!) {
    updateHabit(id: $id, name: $name) {
      id
      name
      completedDays
    }
  }
`;

const { shape, string, array, func } = PropTypes;

EditHabit.propTypes = {
  card: shape({
    id: string.isRequired,
    name: string.isRequired,
    completedDays: array.isRequired,
  }).isRequired,
  habitsUpdateMutation: func.isRequired,
  handleSubmit: func.isRequired,
  toggleEditHabit: func.isRequired,
};

export default graphql(
  HABITS_UPDATE_MUTATION, { name: 'habitsUpdateMutation' },
)(reduxForm({
  validate,
  form: 'editHabit',
  enableReinitialize: true,
})(connect(null, { toggleEditHabit })(EditHabit)));
