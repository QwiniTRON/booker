import mrq from '../myrequest/Myrequest'
import { AUTH_DATA } from './actions/Auth'

export async function analyzeProtectedResponse(response: any, authData: AUTH_DATA) {
  if (response.tokenEnd) {
    // случай если access токен закончился, мы пытаемся обновить токены
    const refreshResult = await refreshToken(authData.refreshToken)
    let resultObject: any

    if (refreshResult.ok) {
      resultObject = refreshResult
    } else {
      resultObject = { ok: false }
      if (refreshResult instanceof Error) resultObject.err = refreshResult
      if (refreshResult.tokenEnd) resultObject.tokenEnd = true
    }

    return resultObject
  } else if (response.notoken) {
    // если токен вообще не был передан
    return { ok: false, notoken: true }
  } else {
    // если пришла ошибка, то просто отправляем её дальше
    return { ok: false, err: response.error || response.message }
  }
}

export async function refreshToken(refreshToken: string) {
  try {
    const refreshResponse = await mrq.post('/api/auth/refresh', {
      refreshToken: refreshToken
    })

    // если токен валиден, возвращаем новую пару токенов
    if (refreshResponse.ok) {
      return {
        accessToken: refreshResponse.token,
        refreshToken: refreshResponse.refreshToken,
        ok: true
      }
    } else {
      const answerObject: any = { ok: false }
      if (refreshResponse.tokenEnd) answerObject.tokenEnd = true
      if (refreshResponse.message) answerObject.message = refreshResponse.message
      return answerObject
    }
  } catch (err) {
    return err
  }
}