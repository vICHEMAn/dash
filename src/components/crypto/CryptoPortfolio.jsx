import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CryptoPortfolio extends Component {

  calculateTotal(amount, price) {
    const total = amount * price;
    return total.toFixed(2);
  }

  totalSum() {
    return this.props.cards.reduce((acc, card) => {
      if (card.amount <= 0) return acc + 0;
      const total = card.amount * card.price_eur;
      return acc + total;
    }, 0);
  }

  renderHoldings() {
    return this.props.cards.map((card) => {
      if (card.amount <= 0) return '';
      return (
        <div className="crypto-portfolio-border" key={`${card.name} portfolio`}>
          <div className="widget-small-row">
            <p className="crypto-asset-title">{card.name}</p>
            <div className="crypto-asset-details">
              <p>{`${card.amount.toFixed(2)} ${card.symbol}`}</p>
              <p>{`${this.calculateTotal(card.amount, card.price_eur)} €`}</p>
            </div>
          </div>
        </div>
      );
    });
  }

  renderPercentages() {
    return this.props.cards.map((card) => {
      if (card.amount <= 0) return '';
      const holdingTotal = card.amount * card.price_eur;
      const percentage = holdingTotal / this.totalSum();
      return (
        <div
          className="crypto-portfolio-percentages-row"
          key={`${card.name} percentage`}
        >
          <p>{card.name}</p>
          <p>{`${(percentage * 100).toFixed(1)}%`}</p>
        </div>
      );
    });
  }

  render() {
    return (
      <div className="crypto-portfolio-container">
        <div className="widget-small non-clickable">
          {this.renderHoldings()}
          <p className="crypto-portfolio-total">
            {`Total ≈ ${this.totalSum().toFixed(2)} €`}
          </p>
          <div className="crypto-portfolio-percentages">
            {this.renderPercentages()}
          </div>
        </div>
      </div>
    );
  }
}

CryptoPortfolio.defaultProps = {
  symbol: '',
  price_eur: 0,
};

const { shape, string, number, arrayOf } = PropTypes;

CryptoPortfolio.propTypes = {
  cards: arrayOf(shape(
    {
      name: string.isRequired,
      symbol: string,
      price_eur: number,
      amount: number.isRequired,
    },
  ),
  ).isRequired,
};

export default CryptoPortfolio;
