import { IAuthor, IBook } from '../../types'
import {
  SET_AUTHOR_LOADING,
  SET_AUTHOR_INFO_BOOKS
} from '../Consts'
import { authorAction } from '../Types'

type authorStateType = {
  authorInfo: IAuthor | {}
  books: IBook[]
  isLoading: boolean
}

const initialState = {
  authorInfo: {},
  books: [],
  isLoading: false
}

export default function (state: authorStateType = initialState, action: authorAction): authorStateType {
  switch (action.type) {
    case SET_AUTHOR_INFO_BOOKS:
      return {...state, authorInfo: action.authoInfo, books: action.books}

    case SET_AUTHOR_LOADING:
      return {...state, isLoading: action.loading}

    default:
      return state
  }
}