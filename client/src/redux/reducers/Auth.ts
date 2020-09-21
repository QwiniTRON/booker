import { authAction } from "../Types";
import {
  SET_TOKENS,
  SET_AUTH_LOADING,
  SET_AUTH_ERROR,
  SET_AUTH_REGISTER_RESULT,
  CLEAR_AUTH_MESSAGES,
  LOGOUT_AUTH
} from '../Consts'

type authStateType = {
  accessToken: string
  refreshToken: string
  authError: string
  loading: boolean
  tokensError: string
  registerResult: boolean
  initAuthPromise: any
}


const initialState = {
  accessToken: '',
  refreshToken: '',
  authError: '',
  loading: false,
  tokensError: '',
  registerResult: false,
  initAuthPromise: null
}

export default function (state: authStateType = initialState, action: authAction): authStateType {
  switch (action.type) {
    case SET_TOKENS:
      return {
        ...state,
        accessToken: action.accessToken,
        refreshToken: action.refreshToken
      }

    case SET_AUTH_LOADING:
      return { ...state, loading: action.loading }

    case SET_AUTH_ERROR:
      return { ...state, authError: action.error }

    case SET_AUTH_REGISTER_RESULT:
      return { ...state, registerResult: action.result }

    case CLEAR_AUTH_MESSAGES:
      return { ...state, registerResult: false, authError: '', tokensError: '' }

    case LOGOUT_AUTH:
      return { ...state, accessToken: '', refreshToken: '' }

    default:
      return state
  }
}