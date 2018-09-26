import axios from 'axios';
import {
  TOGGLE_NEWHABIT,
  TOGGLE_EDITHABIT,
  TOGGLE_HABITCONFIRMREMOVE,
  TOGGLE_NEWCRYPTO,
  UPDATE_CRYPTO,
  CRYPTO_REMOVE,
  CRYPTO_REQUESTDATA,
  GLOBAL_REQUESTDATA,
  TOGGLE_EDITCRYPTO,
  TOGGLE_CRYPTOCONFIRMREMOVE,
  UPDATE_GLOBAL,
} from './types';

/* ==================================
  Habits actions
================================== */

export function toggleNewHabit(bool) {
  return {
    type: TOGGLE_NEWHABIT,
    payload: bool,
  };
}

export function toggleHabitConfirmRemove(bool, id) {
  return {
    type: TOGGLE_HABITCONFIRMREMOVE,
    payload: { bool, id },
  };
}

export function toggleEditHabit(bool, card) {
  return {
    type: TOGGLE_EDITHABIT,
    // I pass the whole card so I have access to the card id and title
    payload: { bool, card },
  };
}

/* ==================================
  Crypto actions
================================== */

export function toggleNewCrypto(bool) {
  return {
    type: TOGGLE_NEWCRYPTO,
    payload: bool,
  };
}

export function toggleCryptoConfirmRemove(bool, id) {
  return {
    type: TOGGLE_CRYPTOCONFIRMREMOVE,
    payload: { bool, id },
  };
}

export function toggleEditCrypto(bool, id, name, amount) {
  return {
    type: TOGGLE_EDITCRYPTO,
    payload: { bool, id, name, amount },
  };
}

// used to remove removed cryptoCard from redux state.
export function removeCrypto(id) {
  return {
    type: CRYPTO_REMOVE,
    payload: id,
  };
}

export function updateCrypto(payload) {
  return {
    type: UPDATE_CRYPTO,
    payload,
  };
}

export function updateGlobal(payload) {
  return {
    type: UPDATE_GLOBAL,
    payload,
  };
}

export function requestCryptoData() {
  return {
    type: CRYPTO_REQUESTDATA,
  };
}

export function requestGlobalData() {
  return {
    type: GLOBAL_REQUESTDATA,
  };
}

// Thunk

export function fetchGlobalData(globalData) {
  return (dispatch) => {
    dispatch(requestGlobalData());

    axios.get('https://api.coinmarketcap.com/v2/global/?convert=EUR')
      .then((data) => {
        const response = data.data.data;
        const global = globalData;
        const updatedGlobal = {
          ...global,
          loading: false,
          bitcoin_percentage_of_market_cap: parseFloat(
            response.bitcoin_percentage_of_market_cap,
            10),
          total_market_cap_usd: parseFloat(
            response.quotes.USD.total_market_cap,
            10),
        };
        dispatch(updateGlobal(updatedGlobal));
      });
  };
}

export function fetchCryptoData(cryptoCards) {
  return (dispatch) => {
    // dispatch to set loading state in components
    dispatch(requestCryptoData());

    cryptoCards.forEach((card) => {
      axios.get(`https://api.coinmarketcap.com/v2/ticker/${card.cryptoId}/?convert=EUR`)
      .then((data) => {
        const response = data.data.data;
        const updatedCoin = {
          ...card,
          loading: false,
          symbol: response.symbol,
          name: response.name,
          price_usd: parseFloat(response.quotes.USD.price, 10),
          price_eur: parseFloat(response.quotes.EUR.price, 10),
          change_24h: parseFloat(response.quotes.EUR.percent_change_24h, 10),
          change_7d: parseFloat(response.quotes.EUR.percent_change_7d, 10),
          market_cap_usd: parseFloat(response.quotes.USD.market_cap, 10),
        };
        dispatch(updateCrypto(updatedCoin));
      });
    });
  };
}
