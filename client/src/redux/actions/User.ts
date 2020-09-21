import {
  SET_USER_LIKE,
  ADD_USER_LIKE,
  REMOVE_USER_LIKE,
  ADD_USER_BOOKS,
  SET_USER_BOOKS,
  SET_USER_LOADING
} from '../Consts'
import {
  userAction
} from '../Types'
import { setFirstBookLikes } from '../actions/Book'
import mrq from '../../myrequest/Myrequest'
import { RootState } from '../mainReducer'
import { analyzeProtectedResponse } from '../Helpers'
import { authLogout, setTokens } from '../actions/Auth'
import { IBook } from '../../types'

export function setUserLikes(likes: any[]): userAction {
  return {
    type: SET_USER_LIKE,
    likes
  }
}

export function setUserBooks(books: IBook[]): userAction {
  return {
    type: SET_USER_BOOKS,
    books
  }
}

export function addUserBooks(books: IBook[]): userAction {
  return {
    type: ADD_USER_BOOKS,
    books
  }
}

export function setUserLoading(loading: boolean): userAction {
  return {
    type: SET_USER_LOADING,
    loading
  }
}

export function addUserLikes(like: number): userAction {
  return {
    type: ADD_USER_LIKE,
    like
  }
}

export function removeUserLikes(like: number): userAction {
  return {
    type: REMOVE_USER_LIKE,
    like
  }
}


// FUNCS
const likePostRequest = (book_id: string, state: RootState) => mrq.post('/api/book/like', { book_id: book_id }, {
  headers: {
    'Authorization': `Bearer ${state.auth.accessToken}`
  }
})

const unlikePostRequest = (book_id: string, state: RootState) => mrq.post('/api/book/unlike', { book_id: book_id }, {
  headers: {
    'Authorization': `Bearer ${state.auth.accessToken}`
  }
})

const fetchUserBooks = (state: RootState, limit: number, skip: number) => mrq.post('/api/book/user/books', { skip, limit }, {
  headers: {
    'Authorization': `Bearer ${state.auth.accessToken}`
  }
})


// загрузка первых книг
export function loadFirstUserBook(limit: number) {
  return async function (dispatch: any, getState: () => RootState) {
    try {
      dispatch(setUserLoading(true))

      const booksResponse = await fetchUserBooks(getState(), limit, 0)

      if (booksResponse.ok) {
        dispatch(setUserBooks(booksResponse.data))

      // Если ошибка, то анализируем ответ.
      } else {
        const analyzeResult = await analyzeProtectedResponse(booksResponse, getState().auth)

        // если все токены устарели, разлогиниваем пользователя
        if (!analyzeResult.ok && analyzeResult.tokenEnd) dispatch(authLogout())
        else dispatch(setTokens(analyzeResult.accessToken, analyzeResult.refreshToken))
      }

      dispatch(setUserLoading(false))
    } catch (err) {
      dispatch(setUserLoading(false))
    }
  }
}

// доподгрузка книг
export function loadMoreUserBook(limit: number, skip: number) {
  return async function (dispatch: any, getState: any) {
    try {
      dispatch(setUserLoading(true))

      const booksResponse = await fetchUserBooks(getState(), limit, skip)

      if (booksResponse.ok) {
        dispatch(addUserBooks(booksResponse.data))
      
      // если в ответе ошибка анализируем
      } else {
        const analyzeResult = await analyzeProtectedResponse(booksResponse, getState().auth)

        // если все токены устарели, разлогиниваем пользователя
        if (!analyzeResult.ok && analyzeResult.tokenEnd) dispatch(authLogout())
        else dispatch(setTokens(analyzeResult.accessToken, analyzeResult.refreshToken))
      }

      dispatch(setUserLoading(false))
    } catch (err) {
      dispatch(setUserLoading(false))
    }
  }
}

// поставить на книгу лайк
export function likeBook(book_id: string) {
  return async function (dispatch: any, getState: any) {
    const state: RootState = getState()

    try {
      const likeResponse = await likePostRequest(book_id, state)

      // если не удалось лайкнуть, анализируем ответ.
      if (!likeResponse.ok) {
        const analyzeResult = await analyzeProtectedResponse(likeResponse, state.auth)

        // если удалось обновить токены, устанавливаем их.
        if (analyzeResult.ok) {
          dispatch(setTokens(analyzeResult.accessToken, analyzeResult.refreshToken))

          // делаем повторную попытку
          const retriedLikeResponse = await likePostRequest(book_id, getState())

          // если все хорошо, корректируем лайки на активной книге, добавляем лайк в массив лайков.
          if (retriedLikeResponse.ok) {
            dispatch(setFirstBookLikes(retriedLikeResponse.correctLikes))
            dispatch(addUserLikes(+book_id))
          }

        // если refreshToken просрочен, разлогиниваем пользователя.
        } else if (analyzeResult.tokenEnd) {
          dispatch(authLogout())
        }

      // при успешном запросе корректируем лайки, добавляем лайк в массив лайков.
      } else {
        dispatch(setFirstBookLikes(likeResponse.correctLikes))
        dispatch(addUserLikes(+book_id))
      }
    } catch (err) {

    }
  }
}

// Снять лайк с книги
export function unlikeBook(book_id: string) {
  return async function (dispatch: any, getState: any) {
    const state: RootState = getState()

    try {
      const unlikeResponse = await unlikePostRequest(book_id, state)

      // если запрос вернулся с ошибкой анализируем его.
      if (!unlikeResponse.ok) {
        const analyzeResult = await analyzeProtectedResponse(unlikeResponse, state.auth)
        if (analyzeResult.ok) {
          // если получилось обновить токены, то устанавливаем их.
          dispatch(setTokens(analyzeResult.accessToken, analyzeResult.refreshToken))

          // делаем запрос снова.
          const retriedunlikeResponse = await likePostRequest(book_id, getState())

          // если повторный запрос удался, то убираем книгу из массива лайков, обновляем кол-во лайков на акт. книге.
          if (retriedunlikeResponse.ok) {
            dispatch(setFirstBookLikes(retriedunlikeResponse.correctLikes))
            dispatch(removeUserLikes(+book_id))
          }
        
        // если refreshToken устарел, то разлогиниваем пользователя
        } else if (analyzeResult.tokenEnd) {
          dispatch(authLogout())
        }
      // если запрос удачный просто корректируем количество лайков на активной книге и убираем лайк из массива лайков.
      } else {
        dispatch(setFirstBookLikes(unlikeResponse.correctLikes))
        dispatch(removeUserLikes(+book_id))
      }

    } catch (err) { }

  }
}