import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import CryptoList from './CryptoList';
import CryptoPortfolio from './CryptoPortfolio';

import CRYPTO_QUERY from '../../queries/allCryptoes';

import { toggleNewCrypto, fetchCryptoData, fetchGlobalData } from '../../actions';

class CryptoIndex extends Component {
  constructor(props) {
    super(props);

    this.state = { togglePortfolio: false };
  }

  componentDidMount() {
    this.props.fetchGlobalData(this.props.cryptoGlobal);
  }


  refreshData() {
    this.props.fetchCryptoData(this.props.cryptoCards);
    this.props.fetchGlobalData(this.props.cryptoGlobal);
  }

  renderGlobal() {
    const global = this.props.cryptoGlobal;
    if (global.loading) {
      return (
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
      );
    }
    return (
      <div className="widget-small">
        <div className="widget-small-row crypto-global-row">
          <p>{`${(global.total_market_cap_usd / 1000000000).toFixed(1)}B / $`}</p>
          <p>{`${global.bitcoin_percentage_of_market_cap.toFixed(1)}% BTC`}</p>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div
        className={
          `widget-body crypto-body ${(this.state.togglePortfolio
            ? 'toggle-portfolio'
            : '')}`
          }
      >
        <div className="widget-title">
          <p>CRYPTO</p>
          <div>
            <FontAwesome
              name="repeat"
              tag="i"
              className="refresh"
              onClick={() => this.refreshData()}
            />
            <FontAwesome
              name="plus"
              tag="i"
              className="add-crypto"
              onClick={() => this.props.toggleNewCrypto(true)}
            />
            <FontAwesome
              name={(this.state.togglePortfolio) ? 'fas fa-chevron-left' : 'fas fa-chevron-right'}
              tag="i"
              onClick={() => this.setState({ togglePortfolio: !this.state.togglePortfolio })}
            />
          </div>
        </div>
        <div className="crypto-content">
          <div className="crypto-tracking">
            {this.renderGlobal()}
            {(this.props.cryptoQuery.loading)
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
            :
              <CryptoList
                cryptoQuery={this.props.cryptoQuery.allCryptoes}
                cryptoCards={this.props.cryptoCards}
              />
            }
          </div>
          <TransitionGroup exit={false}>
            {(this.state.togglePortfolio)
              ?
                <CSSTransition
                  timeout={500}
                  classNames="slide-right"
                  appear
                  key="render-crypto-portfolio"
                >
                  <CryptoPortfolio cards={this.props.cryptoCards} />
                </CSSTransition>
              : null
            }
          </TransitionGroup>
        </div>
      </div>
    );
  }
}

const { string, number, func, arrayOf, shape } = PropTypes;

CryptoIndex.defaultProps = {
  cryptoQuery: {},
};

CryptoIndex.propTypes = {
  cryptoQuery: shape({
    allCryptoes: arrayOf(shape({
      id: string.isRequired,
      amount: number.isRequired,
    })),
  }),
  toggleNewCrypto: func.isRequired,
  fetchGlobalData: func.isRequired,
  fetchCryptoData: func.isRequired,
  cryptoCards: arrayOf(shape({
    name: string.isRequired,
    amount: number.isRequired,
  })).isRequired,
  cryptoGlobal: shape({
    name: string.isRequired,
    id: number.isRequired,
    bitcoin_percentage_of_market_cap: number.isRequired,
    total_market_cap_usd: number.isRequired,
  }).isRequired,
};

export default graphql(
  CRYPTO_QUERY, { name: 'cryptoQuery' },
)(connect(null, { toggleNewCrypto, fetchCryptoData, fetchGlobalData })(CryptoIndex));
