import { combineReducers } from 'redux'
import authReducer from './reducers/Auth'
import bookReducer from './reducers/Book'
import useReducer from '../redux/reducers/User'
import INIT from './reducers/INIT'
import authorReducer from './reducers/Author'

const rootReducer = combineReducers({
  auth: authReducer,
  book: bookReducer,
  user: useReducer,
  INIT,
  author: authorReducer
})

export default rootReducer
export type RootState = ReturnType<typeof rootReducer>