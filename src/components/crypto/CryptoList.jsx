import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchCryptoData } from '../../actions';

import CryptoCard from './CryptoCard';

class CryptoList extends Component {

  componentDidMount() {
    this.props.fetchCryptoData(this.props.cryptoQuery);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.cryptoQuery !== this.props.cryptoQuery) {
      this.props.fetchCryptoData(this.props.cryptoQuery);
    }
  }

  renderCards() {
    return this.props.cryptoCards.map(card => (
      <CryptoCard
        id={card.id}
        cryptoId={card.cryptoId}
        loading={card.loading}
        name={card.name}
        price_eur={card.price_eur}
        price_usd={card.price_usd}
        amount={card.amount}
        symbol={card.symbol}
        key={card.id}
        change_24h={card.change_24h}
        market_cap_usd={card.market_cap_usd}
      />
    ));
  }

  render() {
    return (
      <div>
        {this.renderCards()}
      </div>
    );
  }
}

const { arrayOf, shape, string, number, func, bool } = PropTypes;

CryptoList.defaultProps = {
  cryptoQuery: {},
  cryptoCards: {},
};

CryptoList.propTypes = {
  cryptoQuery: arrayOf(shape({
    amount: number.isRequired,
    cryptoId: number.isRequired,
    id: string.isRequired,
  })),
  cryptoCards: arrayOf(shape({
    id: string.isRequired,
    loading: bool.isRequired,
    name: string.isRequired,
    price_eur: number,
    price_usd: number,
    amount: number.isRequired,
    change_24h: number,
    market_cap_usd: number,
  })),
  fetchCryptoData: func.isRequired,
};

export default connect(null, {
  fetchCryptoData,
})(CryptoList);
