import { bookAction } from "../Types";
import { IBook, ICategory } from '../../types'
import {
  SET_BOOK_LOADING,
  SET_BOOKS,
  ADD_BOOKS,
  SET_BOOK_CATEGORIES,
  SET_FIRST_BOOK_LIKES
} from '../Consts'

type bookStateType = {
  loading: boolean,
  books: IBook[],
  searchStatus: boolean,
  endStatus: boolean,
  categories: ICategory[]
}

const initialState = {
  loading: false,
  books: [],
  searchStatus: false,
  endStatus: false,
  categories: []
}

export default function (state: bookStateType = initialState, action: bookAction): bookStateType {
  switch (action.type) {
    case SET_BOOK_LOADING:
      return { ...state, loading: action.isLoading }

    case SET_BOOKS:
      return { ...state, books: action.books, searchStatus: action.books.length === 0, endStatus: false }

    case ADD_BOOKS:
      return { ...state, books: state.books.concat(action.books), endStatus: action.books.length === 0 }

    case SET_BOOK_CATEGORIES:
      return { ...state, categories: action.categories }

    case SET_FIRST_BOOK_LIKES:
      let editedBook = {...state.books[0], likes: String(action.likes)}
      return { ...state, books: [editedBook] }

    default:
      return state
  }
}