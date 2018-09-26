import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import FontAwesome from 'react-fontawesome';

import { toggleEditCrypto, toggleCryptoConfirmRemove } from '../../actions';

class CryptoCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewExtra: false,
    };
  }

  viewExtra() {
    if (!this.state.viewExtra) {
      return this.setState({ viewExtra: true });
    }
    return this.setState({ viewExtra: false });
  }

  calculateTotal() {
    const total = this.props.amount * this.props.price_eur;
    return total.toFixed(2);
  }

  upOrDown() {
    if (this.props.change_24h > 0) return { color: '#00E5DF' };
    return { color: '#D94747' };
  }

  renderBody() {
    if (this.props.loading) {
      return (
        <FontAwesome
          name="fas fa-spinner fa-spin"
          tag="i"
          className="spinner"
        />
      );
    }
    return (
      <div
        className="widget-small-row"
        role="button"
        tabIndex={0}
        onClick={() => this.viewExtra()}
      >
        <p className="crypto-asset-title">{this.props.name}</p>
        <div className="crypto-asset-details">
          <p style={this.upOrDown()}>
            {`${this.props.price_usd.toFixed(2)} $`}
          </p>
          <p>
            <span style={this.upOrDown()}>
              {`${this.props.change_24h}% `}
            </span>
            / 24h
          </p>
        </div>
      </div>
    );
  }

  renderExtra() {
    return (
      <div
        className="widget-small-extra"
        role="button"
        tabIndex={0}
        onClick={() => this.viewExtra()}
      >
        <p>{`${(this.props.market_cap_usd / 1000000000).toFixed(1)}B / $`}</p>
        <p>{`${this.props.price_eur.toFixed(4)} €`}</p>
      </div>
    );
  }

  renderExtraButtons() {
    return (
      <div className="card-body-extra">
        <button
          className="edit-habit button"
          onClick={() => this.props.toggleEditCrypto(true,
                                                      this.props.id,
                                                      this.props.name,
                                                      this.props.amount)}
        >
          Edit
        </button>
        <button
          className="delete-habit button"
          onClick={() => this.props.toggleCryptoConfirmRemove(true, this.props.id)}
        >
          Delete
        </button>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="widget-small clickable">
          {this.renderBody()}
          <TransitionGroup exit={false}>
            {(this.state.viewExtra)
              ? <CSSTransition
                timeout={500}
                classNames="slide"
                appear
                key="render-extra"
              >
                {this.renderExtra()}
              </CSSTransition>
              : null
            }
          </TransitionGroup>
        </div>
        <TransitionGroup exit={false}>
          {(this.state.viewExtra)
            ? <CSSTransition
              timeout={500}
              classNames="fade"
              appear
              key="render-extra"
            >
              {this.renderExtraButtons()}
            </CSSTransition>
            : null
          }
        </TransitionGroup>
      </div>
    );
  }
}

CryptoCard.defaultProps = {
  price_eur: 0,
  price_usd: 0,
  change_24h: 0,
  market_cap_usd: 0,
};

const { string, number, func, bool } = PropTypes;

CryptoCard.propTypes = {
  id: string.isRequired,
  loading: bool.isRequired,
  name: string.isRequired,
  price_eur: number,
  price_usd: number,
  amount: number.isRequired,
  change_24h: number,
  market_cap_usd: number,
  toggleEditCrypto: func.isRequired,
  toggleCryptoConfirmRemove: func.isRequired,
};

export default connect(null, { toggleEditCrypto, toggleCryptoConfirmRemove })(CryptoCard);
