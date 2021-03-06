import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import reducers from './reducers';

const rootReducer = combineReducers({
  reducers,
  form,
});

export default rootReducer;
