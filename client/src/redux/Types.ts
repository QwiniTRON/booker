import {
  SET_AUTH_LOADING,
  SET_TOKENS,
  SET_AUTH_ERROR,
  SET_AUTH_REGISTER_RESULT,
  CLEAR_AUTH_MESSAGES,
  LOGOUT_AUTH,
  SET_BOOK_LOADING,
  SET_BOOKS,
  ADD_BOOKS,
  SET_BOOK_CATEGORIES,
  SET_USER_LIKE,
  SET_FIRST_BOOK_LIKES,
  ADD_USER_LIKE,
  REMOVE_USER_LIKE,
  SET_USER_BOOKS,
  SET_USER_LOADING,
  ADD_USER_BOOKS,
  SET_INIT_STATUS,
  SET_AUTHOR_INFO_BOOKS,
  SET_AUTHOR_LOADING
} from './Consts'
import { IAuthor, IBook, ICategory } from '../types'


export interface IAction {
  type: string,
  [p: string]: any
}

// AUTH
export type authSetLoading = {
  type: typeof SET_AUTH_LOADING
  loading: boolean
}

export type authSetTokens = {
  type: typeof SET_TOKENS,
  accessToken: string
  refreshToken: string
}

export type authSetAuthError = {
  type: typeof SET_AUTH_ERROR,
  error: any
}

export type authSetRegisterResult = {
  type: typeof SET_AUTH_REGISTER_RESULT,
  result: boolean
}

export type authClearMessages = {
  type: typeof CLEAR_AUTH_MESSAGES
}

export type authLogout = {
  type: typeof LOGOUT_AUTH
}

export type authAction = authSetLoading |
  authSetTokens |
  authSetAuthError |
  authSetRegisterResult |
  authClearMessages |
  authLogout


// BOOK 
export type bookSetLoading = {
  type: typeof SET_BOOK_LOADING,
  isLoading: boolean
}

export type setBooks = {
  type: typeof SET_BOOKS,
  books: any[]
}

export type addBooks = {
  type: typeof ADD_BOOKS,
  books: any[]
}

export type setBookCategories = {
  type: typeof SET_BOOK_CATEGORIES,
  categories: ICategory[]
}

export type setFirstBookLikes = {
  type: typeof SET_FIRST_BOOK_LIKES,
  likes: number
}

export type bookAction = bookSetLoading |
  setBooks |
  addBooks |
  setBookCategories |
  setFirstBookLikes


// USER
export type setUserLikes = {
  type: typeof SET_USER_LIKE,
  likes: any[]
}

export type addUserLikes = {
  type: typeof ADD_USER_LIKE,
  like: number
}

export type removeUserLikes = {
  type: typeof REMOVE_USER_LIKE,
  like: number
}

export type logoutClearLikes = {
  type: typeof LOGOUT_AUTH
}

export type setUserLoading = {
  type: typeof SET_USER_LOADING,
  loading: boolean
}

export type setUserBooks = {
  type: typeof SET_USER_BOOKS,
  books: IBook[]
}

export type addUserBooks = {
  type: typeof ADD_USER_BOOKS,
  books: IBook[]
}

export type userAction = setUserLikes |
  addUserLikes |
  removeUserLikes |
  logoutClearLikes |
  setUserLoading |
  setUserBooks |
  addUserBooks

// INIT
export type setInitStatus = {
  type: typeof SET_INIT_STATUS,
  status: boolean
}

export type initAction = setInitStatus

// AUTHOR
export type setAuthorInfoAndBooks = {
  type: typeof SET_AUTHOR_INFO_BOOKS,
  books: IBook[],
  authoInfo: IAuthor
}

export type setAuthorLoading = {
  type: typeof SET_AUTHOR_LOADING,
  loading: boolean
}

export type authorAction = setAuthorInfoAndBooks | setAuthorLoading