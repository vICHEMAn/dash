import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import query from '../../queries/allCryptoes';

import { toggleCryptoConfirmRemove, removeCrypto } from '../../actions';

const CryptoConfirmRemove = (props) => {
  function onYes() {
    props.cryptoRemoveMutation({
      variables: { id: props.id },
      refetchQueries: [{ query }],
    });
    props.removeCrypto(props.id);
    props.toggleCryptoConfirmRemove(false);
  }

  function onNo() {
    props.toggleCryptoConfirmRemove(false);
  }

  return (
    <div
      className="opacity-background"
      role="button"
      tabIndex={0}
      onClick={() => props.toggleCryptoConfirmRemove(false)}
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
          <p className="remove-confirm-p">
            The data will be incinerated with a
            flamethrower. There are no redos.
          </p>
          <div className="box-form-button-row">
            <button className="button" onClick={() => onNo()}>NO</button>
            <button className="button" onClick={() => onYes()}>YES</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CRYPTO_REMOVE_MUTATION = gql`
  mutation removeCryptoMutation(
    $id: ID!,
  ) {
    deleteCrypto(id: $id) {
      cryptoId
    }
  }
`;

const { string, func } = PropTypes;

CryptoConfirmRemove.propTypes = {
  id: string.isRequired,
  toggleCryptoConfirmRemove: func.isRequired,
  cryptoRemoveMutation: func.isRequired,
  removeCrypto: func.isRequired,
};

export default graphql(
  CRYPTO_REMOVE_MUTATION, { name: 'cryptoRemoveMutation' },
)(connect(null, {
  toggleCryptoConfirmRemove,
  removeCrypto,
})(CryptoConfirmRemove));
