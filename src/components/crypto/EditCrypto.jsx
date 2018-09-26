import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import query from '../../queries/allCryptoes';

import { toggleEditCrypto } from '../../actions';

class EditCrypto extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(values) {
    const amount = parseFloat(values.amount, 10);
    const add = parseFloat(values.add, 10);
    const remove = parseFloat(values.remove, 10);

    const totalAmount = () => {
      let counter = amount;
      if (add > 0) counter += add;
      if (remove > 0) counter -= remove;
      return (counter > 0) ? counter : 0;
    };

    this.props.cryptoEditMutation({
      variables: {
        id: this.props.id,
        amount: totalAmount(),
      },
      refetchQueries: [{ query }],
    });
    this.props.toggleEditCrypto(false);
  }

  renderField(field) {
    let placeholder = 'Enter Amount';
    if (field.input.name === 'remove') placeholder = 'Enter amount to remove';
    if (field.input.name === 'add') placeholder = 'Enter amount to add';

    return (
      <div className="form-field">
        <label htmlFor={field.label}>{field.label}</label>
        <input
          id={field.label}
          type="number"
          placeholder={placeholder}
          {...field.input}
        />
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
        onClick={() => this.props.toggleEditCrypto(false)}
      >
        <div
          role="presentation"
          className="widget-body opacity-content"
          onClick={e => e.stopPropagation()}
        >
          <div className="widget-title">
            <p>EDIT CRYPTO</p>
          </div>
          <div className="box-form-body">
            <form onSubmit={handleSubmit(this.onSubmit)}>
              <Field
                label={`${this.props.initialValues.name} Amount`}
                name="amount"
                component={this.renderField}
              />
              <Field
                name="add"
                component={this.renderField}
              />
              <Field
                name="remove"
                component={this.renderField}
              />
              <div className="box-form-button-row">
                <button
                  className="button"
                  type="button"
                  onClick={() => this.props.toggleEditCrypto(false)}
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

const EDIT_CRYPTO_MUTATION = gql`
  mutation editCryptoMutation(
    $id: ID!,
    $amount: Float!,
  ) {
    updateCrypto(
      id: $id,
      amount: $amount,
    ) {
      id
      amount
      cryptoId
    }
  }
`;

const { func, number, string, shape } = PropTypes;

EditCrypto.propTypes = {
  initialValues: shape({
    name: string,
    amount: number,
  }).isRequired,
  id: string.isRequired,
  toggleEditCrypto: func.isRequired,
  handleSubmit: func.isRequired,
  cryptoEditMutation: func.isRequired,
};

const EditCryptoForm = reduxForm({
  form: 'newCrypto',
  enableReinitialize: true,
})(EditCrypto);

const ComposedEditCrypto = connect(null,
  { toggleEditCrypto })(EditCryptoForm);

export default graphql(
  EDIT_CRYPTO_MUTATION, { name: 'cryptoEditMutation' },
)(ComposedEditCrypto);
