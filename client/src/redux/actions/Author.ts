import mrq from '../../myrequest/Myrequest'
import { IBook } from '../../types'
import {
  SET_AUTHOR_INFO_BOOKS,
  SET_AUTHOR_LOADING
} from '../Consts'
import { authorAction } from '../Types'

export function setLoding(isLoading: boolean): authorAction {
  return {
    type: SET_AUTHOR_LOADING,
    loading: isLoading
  }
}

export function setAuthorInfoAndBooks(authoInfo: any, books: IBook[]): authorAction {
  return {
    type: SET_AUTHOR_INFO_BOOKS,
    authoInfo,
    books
  }
}

// Funcs
const authorInfoRequest = (authorId: string) => mrq.get(`/api/book/author/${authorId}`)

// Загрузка информации по указанному автору
export function loadAuthorData(authorId: string) {
  return async function (dispatch: any, getState: any) {
    try {
      dispatch(setLoding(true))

      const authorResponse = await authorInfoRequest(authorId)
      if(authorResponse.ok) dispatch(setAuthorInfoAndBooks(
        authorResponse.data.author,
        authorResponse.data.books
      ))

      dispatch(setLoding(false))
    } catch (err) {
      dispatch( setLoding(false))
    }
  }
}