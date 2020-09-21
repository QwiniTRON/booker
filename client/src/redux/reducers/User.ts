import { IBook, ICategory } from '../../types'
import {
  SET_USER_LIKE,
  ADD_USER_LIKE,
  REMOVE_USER_LIKE,
  LOGOUT_AUTH,
  SET_USER_BOOKS,
  SET_USER_LOADING,
  ADD_USER_BOOKS
} from '../Consts'
import { userAction } from '../Types'

type usetStateType = {
  likes: any[],
  isLoading: boolean,
  books: IBook[]
  endStatus: boolean
}

const initialState = {
  likes: [],
  isLoading: false,
  books: [],
  endStatus: false
}

export default function (state: usetStateType = initialState, action: userAction): usetStateType {
  switch (action.type) {

    case SET_USER_LIKE:
      return { ...state, likes: action.likes }

    case ADD_USER_LIKE:
      return { ...state, likes: [...state.likes, action.like] }

    case REMOVE_USER_LIKE:
      return { ...state, likes: state.likes.filter((like) => like != action.like) }

    case LOGOUT_AUTH:
      return { ...state, likes: [] }

    case SET_USER_LOADING:
      return { ...state, isLoading: action.loading}

    case SET_USER_BOOKS:
      return { ...state, books: action.books, endStatus: false }

    case ADD_USER_BOOKS:
      return { ...state, books: [...state.books, ...action.books], endStatus: action.books.length === 0 }

    default:
      return state
  }
}