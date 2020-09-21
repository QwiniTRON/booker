import mrq from '../../myrequest/Myrequest'
import { AUTH_DATA, setTokens, setLoading } from '../actions/Auth'
import { setBookCategories } from '../actions/Book'
import { analyzeProtectedResponse, refreshToken } from '../Helpers'
import { setUserLikes } from '../actions/User'
import {initAction} from '../Types'
import {SET_INIT_STATUS} from '../Consts'


export function setInitStatus (status: boolean): initAction {
  return {
    type: SET_INIT_STATUS,
    status
  }
}

export function INIT_APP() {

  return async function (dispatch: any, getState: any) {
    // проверяем хранилище токенов
    let authData: any = localStorage.getItem('auth_data')

    // получение категорий книг для сайд панели
    mrq.get('/api/book/categories').then((categoriesResponse) => {
      if (!categoriesResponse.ok) throw categoriesResponse.error ? categoriesResponse.error : categoriesResponse.message

      dispatch(setBookCategories(categoriesResponse.data))
    }).catch((err) => { })

    // если есть данные в хранилище, то пверяем их валидность
    if (authData) {
      try {
        authData = JSON.parse(authData) as AUTH_DATA

        // запрос на проверку валидности данных пользователя
        const response = await mrq.post('/api/auth/check', {}, {
          headers: {
            'Authorization': `Bearer ${authData.accessToken}`
          }
        })

        // токен валиден, можно установить его в стор
        if (response.ok) {
          dispatch(setTokens(authData.accessToken, authData.refreshToken))
          dispatch(setInitStatus(true))


          // получение лайков для пользоватлея
          const userLikes = await mrq.post('/api/book/likes/user', {}, {
            headers: {
              'Authorization': `Bearer ${authData.accessToken}`
            }
          })

          if (userLikes.ok) dispatch(setUserLikes(userLikes.data))
        } else {
          // Если не валиден, то пытаемся обновить токен
          const refreshResult = await refreshToken(authData.refreshToken)
          if (refreshResult.ok) {
            dispatch(setTokens(refreshResult.accessToken, refreshResult.refreshToken))
            dispatch(setInitStatus(true))


            // получение лайков пользователя
            const userLikes = await mrq.post('/api/book/likes/user', {}, {
              headers: {
                'Authorization': `Bearer ${authData.accessToken}`
              }
            })

            if (userLikes.ok) dispatch(setUserLikes(userLikes.data))
          } else {
            // получилось что обновить токены невышло, значит они все устарели, просто чистим хранилище
            localStorage.removeItem('auth_data')
            dispatch(setInitStatus(true))
          }
        }
      } catch (err) {
        // при инициализации произошла ошибка
        console.log(err, 'init error');
        dispatch(setInitStatus(true))
      }

    } else {
      // если авторизационные данные невалидны или отсутствуют чистим хранилище
      dispatch(setInitStatus(true))
      localStorage.removeItem('auth_data')
    }
  }

}