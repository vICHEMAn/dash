import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import query from '../../queries/allHabits';

import { toggleNewHabit } from '../../actions';

class NewHabit extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(values) {
    this.props.habitsCreateMutation({
      variables: {
        name: values.habit,
        completedDays: [],
      },
      refetchQueries: [{ query }],
    });
    this.props.toggleNewHabit(false);
  }

  renderField(field) {
    return (
      <div className="form-field">
        <label htmlFor={field.label}>{field.label}</label>
        <input id={field.label} type="text" placeholder="Name me" {...field.input} />
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
        onClick={() => this.props.toggleNewHabit(false)}
      >
        <div
          role="presentation"
          className="widget-body opacity-content"
          onClick={e => e.stopPropagation()}
        >
          <div className="widget-title">
            <p>ADD HABIT</p>
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
                  className="button"
                  type="button"
                  onClick={() => this.props.toggleNewHabit(false)}
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

const HABITS_CREATE_MUTATION = gql`
  mutation createHabitMutation(
    $name: String!,
    $completedDays: [String!]
    ) {
    createHabit(name: $name, completedDays: $completedDays) {
      id
      name
      completedDays
    }
  }
`;

const { func } = PropTypes;

NewHabit.propTypes = {
  habitsCreateMutation: func.isRequired,
  handleSubmit: func.isRequired,
  toggleNewHabit: func.isRequired,
};

export default graphql(
  HABITS_CREATE_MUTATION, { name: 'habitsCreateMutation' },
)(reduxForm({
  validate,
  form: 'newHabit',
})(connect(null, { toggleNewHabit })(NewHabit)));
