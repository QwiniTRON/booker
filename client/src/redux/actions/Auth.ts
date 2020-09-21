import mrq from '../../myrequest/Myrequest'
import {
  SET_TOKENS,
  SET_AUTH_LOADING,
  SET_AUTH_ERROR,
  SET_AUTH_REGISTER_RESULT,
  CLEAR_AUTH_MESSAGES,
  LOGOUT_AUTH
} from '../Consts'
import {
  authAction
} from '../Types'
import { setUserLikes } from './User'

export function setLoading(isLoading: boolean): authAction {
  return {
    type: SET_AUTH_LOADING,
    loading: isLoading
  }
}

export function setTokens(accessToken: string, refreshToken: string): authAction {
  return {
    type: SET_TOKENS,
    accessToken,
    refreshToken
  }
}

export function setAuthError(error: string): authAction {
  return {
    type: SET_AUTH_ERROR,
    error: error
  }
}

export function setRegisterResult(result: boolean): authAction {
  return {
    type: SET_AUTH_REGISTER_RESULT,
    result
  }
}

export function clearAuthStatuses(): authAction {
  return {
    type: CLEAR_AUTH_MESSAGES
  }
}

export function authLogout(): authAction {
  // при разлогине чистим хранилище
  localStorage.removeItem('auth_data')

  return {
    type: LOGOUT_AUTH
  }
}



// FUNCS
const userLikeRequest = (accessToken: any) => mrq.post('/api/book/likes/user', {}, {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
})


export function register(email: string, password: string, passwordr: string, nickname: string) {
  return async function (dispatch: any, state: any) {
    try {
      dispatch(clearAuthStatuses())
      dispatch(setLoading(true))

      const response = await mrq.post('/api/auth/register', { email, password, passwordr, nickname })
      console.log(response, 'reg');

      // если есть ошибка кидаем её
      if (!response.ok) throw response.error ? response.error : response.message

      if (response.register === true) dispatch(setRegisterResult(true))

      dispatch(setLoading(false))
    } catch (err) {
      // записываем ошибку в тор для отображения
      dispatch(setAuthError(String(err)))
      dispatch(setLoading(false))
    }
  }
}

export function login(email: string, password: string) {
  return async function (dispatch: any, state: any) {
    try {
      dispatch(clearAuthStatuses())
      dispatch(setLoading(true))

      const response = await mrq.post('/api/auth/login', { email, password })

      if (!response.ok) throw response.error ? response.error : response.message

      dispatch(setTokens(response.token, response.refreshToken))
      localStorage.setItem(
        'auth_data',
        JSON.stringify({
          accessToken: response.token,
          refreshToken: response.refreshToken
        })
      )
      dispatch(setLoading(false))

      // После авторизации нужно подгрузить лайки пользователя
      const userLikes = await userLikeRequest(response.token)
      if (userLikes.ok) dispatch(setUserLikes(userLikes.data))

    } catch (err) {
      // если была ошибка записываем её для отображния
      dispatch(setAuthError(err ? String(err) : ''))
      dispatch(setLoading(false))
    }
  }
}

// ** TYPE **
export type AUTH_DATA = {
  accessToken: string
  refreshToken: string
}