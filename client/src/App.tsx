import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { } from '@fortawesome/fontawesome-svg-core'
import './App.scss'
import Layout from './Hocs/Layout'
import Auth from './containers/Auth/Auth'
import Books from './containers/Books/Books'
import Logout from './components/Logout/Logout'
import { RootState } from './redux/mainReducer'
import { INIT_APP } from './redux/actions/Init'
import ErrorBounder from './components/ErrorBounder/ErrorBounder'
import AboutBook from './containers/AboutBook/AboutBook'
import UserBooks from './containers/UserBooks/UserBooks'
import AuthorPage from './containers/Author/Author'
import { CSSTransition } from 'react-transition-group'

type AppProps = {
  [p: string]: any
}

const App: React.FC<AppProps> = function (props) {
  useEffect(() => {
    // после первого рендера делаем инициализацию приложения
    // пока инициализация не будет произведена, операции связанные с данными пользователя
    // будут ждать пока инициализация кончится.
    props.INIT_APP()
  }, [])

  const routes: any = [
    { path: '/mybooks', component: UserBooks, exact: false },
    { path: '/aboutbook/:id', component: AboutBook, exact: false },
    { path: '/author/:id', component: AuthorPage, exact: false },
  ]

  if (props.isAuth) routes.push({ path: '/logout', component: Logout, exact: false })
  else routes.push({ path: '/auth', component: Auth, exact: false })

  routes.push(({ path: ['/book', '/book/:category'], component: Books, exact: true }))

  // анимация переходов
  const routesJsx = routes.map((route: any, i: number) => (
    <Route path={route.path} exact={route.exact} key={i} >
      {(router: any) => (
        <CSSTransition
          in={router.match != null}
          timeout={300}
          unmountOnExit
          classNames="page"
        >
          <div className="page">
            <route.component />
          </div>
        </CSSTransition>
      )}
    </Route>
  ))
  routesJsx.push((<Redirect key="redirect404" to='/book' />))


  return (
    <div className="App">
      <ErrorBounder>
        <Layout>
            {routesJsx}
        </Layout>
      </ErrorBounder>
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({
  isAuth: state.auth.accessToken
})

const mapDispatchToProps = {
  INIT_APP
}

export default connect(mapStateToProps, mapDispatchToProps)(App)