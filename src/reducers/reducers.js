import {
  TOGGLE_NEWHABIT,
  TOGGLE_EDITHABIT,
  TOGGLE_HABITCONFIRMREMOVE,
  TOGGLE_NEWCRYPTO,
  UPDATE_CRYPTO,
  UPDATE_GLOBAL,
  CRYPTO_ADD,
  CRYPTO_EDIT,
  CRYPTO_REMOVE,
  CRYPTO_REQUESTDATA,
  TOGGLE_EDITCRYPTO,
  TOGGLE_CRYPTOCONFIRMREMOVE,
  GLOBAL_REQUESTDATA,
} from '../actions/types';

const initialState = {
  newHabitVisible: false,
  editHabitVisible: { bool: false, card: {} },
  confirmRemoveHabitVisible: { bool: false, id: null },
  newCryptoVisible: false,
  editCryptoVisible: { bool: false, id: null },
  confirmRemoveCryptoVisible: { bool: false, id: null },
  cryptoGlobal: {
    id: 0,
    loading: false,
    name: 'global',
    bitcoin_percentage_of_market_cap: 100,
    total_market_cap_usd: 100,
  },
  cryptoCards: [],
};

/* =======================
  Reducers
======================= */

export default function (state = initialState, action) {
  switch (action.type) {

    /* =========
      Habits
    ========= */

    case TOGGLE_NEWHABIT:
      // Changes UI state to show box
      return { ...state, newHabitVisible: action.payload };

    case TOGGLE_EDITHABIT:
    // Changes UI state to show box
      return {
        ...state,
        editHabitVisible: {
          bool: action.payload.bool,
          card: action.payload.card,
        },
      };

    case TOGGLE_HABITCONFIRMREMOVE:
      return {
        ...state,
        confirmRemoveHabitVisible: {
          bool: action.payload.bool,
          id: action.payload.id,
        },
      };

    /* =========
      Crypto
    ========= */

    case TOGGLE_NEWCRYPTO:
      return { ...state, newCryptoVisible: action.payload };

    case TOGGLE_CRYPTOCONFIRMREMOVE:
      return {
        ...state,
        confirmRemoveCryptoVisible: {
          bool: action.payload.bool,
          id: action.payload.id,
        },
      };

    case TOGGLE_EDITCRYPTO:
      return { ...state,
        editCryptoVisible: {
          bool: action.payload.bool,
          id: action.payload.id,
          name: action.payload.name,
          amount: action.payload.amount,
        },
      };

    case CRYPTO_ADD:
      return { ...state, cryptoCards: [...state.cryptoCards, action.payload] };

    case CRYPTO_REMOVE: {
      const updatedCryptoCards = state.cryptoCards
                                  .filter(card => card.id !== action.payload);
      return { ...state, cryptoCards: updatedCryptoCards };
    }

    case CRYPTO_EDIT: {
      const updatedCryptoCards = state.cryptoCards.map((card) => {
        if (card.id === action.payload.id) {
          return {
            ...card,
            amount: action.payload.amount,
          };
        }
        return card;
      });

      return { ...state, cryptoCards: updatedCryptoCards };
    }

    case CRYPTO_REQUESTDATA: {
      return {
        ...state,
        cryptoCards: state.cryptoCards.map(card => ({ ...card, loading: true })),
      };
    }

    case GLOBAL_REQUESTDATA: {
      return {
        ...state,
        cryptoGlobal: { ...state.cryptoGlobal, loading: true },
      };
    }

    case UPDATE_GLOBAL:
      return {
        ...state,
        cryptoGlobal: action.payload,
      };

    case UPDATE_CRYPTO:
      // check if crypto exists in array and add if it if not.
      if (!state.cryptoCards.find(item => item.id === action.payload.id)) {
        return {
          ...state,
          cryptoCards: [
            ...state.cryptoCards,
            action.payload,
          ],
        };
      }
      // update crypto
      return {
        ...state,
        cryptoCards: state.cryptoCards.map((card) => {
          if (card.id === action.payload.id) return action.payload;
          return card;
        }),
      };

    default:
      return state;
  }
}
