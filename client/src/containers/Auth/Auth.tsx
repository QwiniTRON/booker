import React, { useState, useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import LoginForm from '../../components/Forms/LoginForm'
import RegisterForm from '../../components/Forms/RegisterForm'
import {
  login,
  register
} from '../../redux/actions/Auth'
import { RootState } from '../../redux/mainReducer'

import c from './Auth.module.scss'

type AuthProps = {
  [p: string]: any
}

const Auth: React.FC<AuthProps> = (props) => {
  const [isLogin, setLogin] = useState(true)
  useEffect(() => {
    if (props.isAuth) props.history.push('/')
  }, [props.isAuth])


  const loginHandle = useCallback((values) => {
    console.log('login', values);
    props.login(values.email, values.password)
  }, [])

  const registerHandle = useCallback(({ email, password, passwordr, nickname }) => {
    console.log('reg', email, password, passwordr, nickname);
    props.register(email, password, passwordr, nickname)
  }, [])


  return (
    <div className={c['auth']}>
      <h2 className={c['main-title']}>
        {isLogin ? 'Вход' : 'Регистрация'}
      </h2>
      <p className={c['server-error']}>{props.authError}</p>
      <p className={c['server-succes']}>{props.registerResult && 'Вы успешно зарегистрированы'}</p>
      {isLogin ?
        <LoginForm isLoading={props.isLoading} onSubmit={loginHandle} /> :
        !props.registerResult &&
        <RegisterForm isLoading={props.isLoading} onSubmit={registerHandle} />
      }
      <p className="pseudolink" onClick={e => setLogin(!isLogin)}>
        {isLogin ? 'Зарегистрироваться!' : 'Войти'}
      </p>
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    isLoading: state.auth.loading,
    authError: state.auth.authError,
    registerResult: state.auth.registerResult,
    isAuth: state.auth.accessToken
  }
}

const mapDispatchToProps = {
  login,
  register
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth)