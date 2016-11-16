import { createStore } from 'redux';
import { combineReducers } from 'redux-immutable';

import Immutable from 'immutable'

import FilesReducer from './files.js'
import CodeReducer from './code.js'
import UIReducer from './ui.js'

export default function configureStore(initialState) {
  let store = createStore(combineReducers({
		files: FilesReducer,
		code: CodeReducer,
		ui: UIReducer
  }), Immutable.Map(initialState))
  return store
}