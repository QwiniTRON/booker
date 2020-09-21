import mrq from '../../myrequest/Myrequest'
import {
  SET_BOOK_LOADING,
  SET_BOOKS,
  ADD_BOOKS,
  SET_BOOK_CATEGORIES,
  SET_FIRST_BOOK_LIKES
} from '../Consts'

export function setLoding(isLoading: boolean) {
  return {
    type: SET_BOOK_LOADING,
    isLoading
  }
}

export function setFirstBookLikes(likes: number) {
  return {
    type: SET_FIRST_BOOK_LIKES,
    likes
  }
}

export function setBooks(books: any[]) {
  return {
    type: SET_BOOKS,
    books
  }
}

export function addBooks(books: any[]) {
  return {
    type: ADD_BOOKS,
    books
  }
}

export function setBookCategories(categories: any[]) {
  return {
    type: SET_BOOK_CATEGORIES,
    categories
  }
}

// загрузка первых книг в стор по заданным данным
export function loadFirstBooks(category: string, search: string, sort: string, offset: number, limit: number) {
  return async function (dispatch: any, getState: any) {
    try {
      dispatch(setLoding(true))

      let queryString = `/api/book`
      if (category) queryString += `/${String(category)}`

      const responseBooks = await mrq.get(queryString, {
        query: {
          sort, search, limit: String(limit), skip: String(offset)
        }
      })

      if (!responseBooks.ok) throw responseBooks.error ? responseBooks.error : responseBooks.message
      if (!(responseBooks.data instanceof Array)) responseBooks.data = []

      dispatch(setBooks(responseBooks.data))
      dispatch(setLoding(false))
    } catch (err) {
      dispatch(setLoding(false))
    }
  }
}

// догрузка новых книг в стор
export function loadMoreBooks(category: string, search: string, sort: string, offset: number, limit: number) {
  return async function (dispatch: any, getState: any) {
    try {
      dispatch(setLoding(true))

      let queryString = `/api/book`
      if (category) queryString += `/${String(category)}`
      const response = await mrq.get(queryString, {
        query: {
          sort, search, limit: String(limit), skip: String(offset)
        }
      })

      if (!response.ok) throw response.error ? response.error : response.message
      if (!(response.data instanceof Array)) response.data = []

      dispatch(addBooks(response.data))
      dispatch(setLoding(false))
    } catch (err) {
      dispatch(setLoding(false))
    }
  }
}

// получении информации о книге по id
export function loadOneBookInfo(id: string) {
  return async function (dispatch: any, getState: any) {
    try {
      dispatch(setLoding(true))

      let queryString = `/api/book/one/${id}`
      const response = await mrq.get(queryString)

      if (!response.ok) throw response.error ? response.error : response.message

      dispatch(setBooks([response.data]))
      dispatch(setLoding(false))
    } catch (err) {
      dispatch(setLoding(false))
    }
  }
}