import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import axios from 'axios';
import { debounce } from 'lodash';
import FontAwesome from 'react-fontawesome';

import query from '../../queries/allCryptoes';

import { toggleNewCrypto } from '../../actions';

class AddCrypto extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.renderRadios = this.renderRadios.bind(this);
    // debouncing to reduce ui lag
    this.debouncedOnChange = debounce(this.onChange, 500);

    this.state = {
      cryptoList: null,
      search: '',
    };
  }

  componentDidMount() {
    axios.get('https://api.coinmarketcap.com/v2/listings/')
     .then(resp => this.setState({ cryptoList: resp.data.data }));
  }

  onChange(event) {
    this.setState({
      ...this.state,
      search: event.target.value,
    });
  }

  onSubmit(values) {
    const crypto = JSON.parse(values.crypto);
    const amount = (values.amount) ? parseFloat(values.amount, 10) : 0;

    this.props.cryptoNewMutation({
      variables: {
        cryptoId: crypto.id,
        amount,
      },
      refetchQueries: [{ query }],
    });
    this.props.toggleNewCrypto(false);
  }

  filterCryptos() {
    if (this.state.search === '') return this.state.cryptoList;

    const regEx = new RegExp(this.state.search, 'gi');

    return this.state.cryptoList.filter((item) => {
      if (item.name.match(regEx)) return item;
      return null;
    });
  }

  renderField(field) {
    const placeholder = (field.label === 'Amount')
      ? 'Enter amount'
      : 'Search and select crypto';
    const inputType = (field.label === 'Amount')
      ? 'number'
      : 'text';

    return (
      <div className="form-field">
        <label htmlFor={field.label}>{field.label}</label>
        <input
          id={field.label}
          type={inputType}
          placeholder={placeholder}
          {...field.input}
        />
        <p>{field.meta.touched ? field.meta.error : ''}</p>
      </div>
    );
  }

  renderRadios(field) {
    return (
      <div className="flex">
        <div className="search-results-box">
          {field.options.map((item) => {
            const value = JSON.stringify(item);
            return (
              // Not using Field component because of bug with type="radio"
              <label
                className="search-result"
                key={`${item.id}`}
              >
                <input
                  type="radio"
                  {...field.input}
                  value={value}
                  checked={value === field.input.value}
                />
                <p className={`${(value === field.input.value)
                    ? 'checked'
                    : ''}`}
                >{item.name}</p>
                <p className={`${(value === field.input.value)
                  ? 'checked'
                  : ''}`}
                >{item.symbol}</p>
              </label>
            );
          })}
        </div>
        <p className="form-error">{field.meta.touched ? field.meta.error : ''}</p>
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
        onClick={() => this.props.toggleNewCrypto(false)}
      >
        <div
          role="presentation"
          className="widget-body opacity-content"
          onClick={e => e.stopPropagation()}
        >
          <div className="widget-title">
            <p>ADD CRYPTO</p>
          </div>
          <div className="box-form-body">
            <form onSubmit={handleSubmit(this.onSubmit)}>
              <Field
                label="Crypto name"
                name="name"
                onChange={this.debouncedOnChange}
                component={this.renderField}
              />
              {
                (this.state.cryptoList === null)
                ? <div className="search-results-box">
                  <FontAwesome
                    name="fas fa-spinner fa-spin"
                    tag="i"
                    className="spinner"
                  />
                </div>
                : <Field
                  name="crypto"
                  id="cryptos"
                  component={this.renderRadios}
                  options={this.filterCryptos()}
                />
              }
              <Field
                label="Amount (optional)"
                name="amount"
                component={this.renderField}
              />
              <div className="box-form-button-row">
                <button
                  className="button"
                  type="button"
                  onClick={() => this.props.toggleNewCrypto(false)}
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

function validate(values, props) {
  const crypto = (values.crypto) ? JSON.parse(values.crypto) : null;

  const errors = {};

  if (!values.crypto) {
    errors.crypto = 'Search and select a Crypto';
  }

  if (values.crypto) {
    props.cryptoCards.find((card) => {
      if (card.name === crypto.name) {
        errors.crypto = 'Select a crypto that is not already being tracked.';
      }
      return null;
    });
  }

  return errors;
}

const CRYPTO_NEW_MUTATION = gql`
  mutation newCryptoMutation(
    $amount: Float!,
    $cryptoId: Int!,
  ) {
    createCrypto(amount: $amount, cryptoId: $cryptoId) {
      id
      amount
      cryptoId
    }
  }
`;

const { func } = PropTypes;

AddCrypto.propTypes = {
  cryptoNewMutation: func.isRequired,
  toggleNewCrypto: func.isRequired,
  handleSubmit: func.isRequired,
};

const AddCryptoForm = reduxForm({
  validate,
  form: 'newCrypto',
})(AddCrypto);

const ComposedAddCrypto = connect(null,
  { toggleNewCrypto })(AddCryptoForm);

export default graphql(
  CRYPTO_NEW_MUTATION, { name: 'cryptoNewMutation' },
)(ComposedAddCrypto);
