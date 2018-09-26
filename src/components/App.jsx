import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { connect } from 'react-redux';

import HabitsIndex from './habits/HabitsIndex';
import NewHabit from './habits/NewHabit';
import EditHabit from './habits/EditHabit';
import HabitConfirmRemove from './habits/HabitConfirmRemove';

import CryptoIndex from './crypto/CryptoIndex';
import NewCrypto from './crypto/NewCrypto';
import EditCrypto from './crypto/EditCrypto';
import CryptoConfirmRemove from './crypto/CryptoConfirmRemove';

import '../stylesheets/index.scss';

class App extends Component {

  renderNewHabit() {
    return (this.props.newHabitVisible)
    ?
      <CSSTransition
        timeout={500}
        classNames="fade-fast"
        appear
        key="render-new-habit"
      >
        <NewHabit />
      </CSSTransition>
    : '';
  }

  renderEditHabit() {
    return (this.props.editHabitVisible.bool)
    ?
      <CSSTransition
        timeout={500}
        classNames="fade-fast"
        appear
        key="render-edit-habit"
      >
        <EditHabit
          card={this.props.editHabitVisible.card}
          initialValues={{ habit: this.props.editHabitVisible.card.name }}
        />
      </CSSTransition>
    : '';
  }

  renderHabitConfirmRemove() {
    return (this.props.confirmRemoveHabitVisible.bool)
    ?
      <CSSTransition
        timeout={500}
        classNames="fade-fast"
        appear
        key="render-habit-confirm-remove"
      >
        <HabitConfirmRemove id={this.props.confirmRemoveHabitVisible.id} />
      </CSSTransition>
    : '';
  }

  renderNewCrypto() {
    return (this.props.newCryptoVisible)
    ?
      <CSSTransition
        timeout={500}
        classNames="fade-fast"
        appear
        key="render-new-crypto"
      >
        <NewCrypto cryptoCards={this.props.cryptoCards} />
      </CSSTransition>
    : '';
  }

  renderEditCrypto() {
    const initialValues = {
      name: this.props.editCryptoVisible.name,
      amount: this.props.editCryptoVisible.amount,
    };
    return (this.props.editCryptoVisible.bool)
    ?
      <CSSTransition
        timeout={500}
        classNames="fade-fast"
        appear
        key="render-edit-crypto"
      >
        <EditCrypto
          id={this.props.editCryptoVisible.id}
          initialValues={initialValues}
        />
      </CSSTransition>
    : '';
  }

  renderCryptoConfirmRemove() {
    return (this.props.confirmRemoveCryptoVisible.bool)
    ?
      <CSSTransition
        timeout={500}
        classNames="fade-fast"
        appear
        key="render-crypto-confirm-remove"
      >
        <CryptoConfirmRemove id={this.props.confirmRemoveCryptoVisible.id} />
      </CSSTransition>
      : '';
  }

  render() {
    return (
      <div className="background">
        <div className="container">
          <HabitsIndex />
          <CryptoIndex
            cryptoCards={this.props.cryptoCards}
            cryptoGlobal={this.props.cryptoGlobal}
          />
          <TransitionGroup exit={false} className="container-boxes">
            {this.renderNewHabit()}
            {this.renderEditHabit()}
            {this.renderHabitConfirmRemove()}
            {this.renderNewCrypto()}
            {this.renderEditCrypto()}
            {this.renderCryptoConfirmRemove()}
          </TransitionGroup>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    newHabitVisible: state.reducers.newHabitVisible,
    editHabitVisible: state.reducers.editHabitVisible,
    confirmRemoveHabitVisible: state.reducers.confirmRemoveHabitVisible,
    confirmRemoveCryptoVisible: state.reducers.confirmRemoveCryptoVisible,
    newCryptoVisible: state.reducers.newCryptoVisible,
    editCryptoVisible: state.reducers.editCryptoVisible,
    cryptoCards: state.reducers.cryptoCards,
    cryptoGlobal: state.reducers.cryptoGlobal,
  };
}

const { bool, shape, string, number, arrayOf, array } = PropTypes;

App.propTypes = {
  newCryptoVisible: bool.isRequired,
  editCryptoVisible: shape({
    id: string,
    bool: bool.isRequired,
  }).isRequired,
  confirmRemoveCryptoVisible: shape({
    bool: bool.isRequired,
    id: string,
  }).isRequired,
  newHabitVisible: bool.isRequired,
  editHabitVisible: shape({
    bool: bool.isRequired,
    card: shape({
      id: number,
      title: string,
      streak: number,
      completedDays: array,
    }),
  }).isRequired,
  confirmRemoveHabitVisible: shape({
    bool: bool.isRequired,
    id: number,
  }).isRequired,
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

export default connect(mapStateToProps)(App);
