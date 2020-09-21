import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

import c from './Header.module.scss'

type Headerprops = {
  isAuth: boolean
}

const Header: React.FC<Headerprops> = (props) => {
  const [isOpen, setOpen] = useState(false)
  const toggleMenu = () => { setOpen(!isOpen) }

  const menuClasses = [c['menu']]
  if (isOpen) menuClasses.push(c['open'])

  const links: any = [{
    to: '/book',
    text: 'Книги',
    exact: false
  },
  {
    to: '/mybooks',
    text: 'Мои книги',
    exact: false
  },]

  if (props.isAuth) links.push({
    to: '/logout',
    text: 'Выйти',
    exact: false,
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (! window.confirm('Выйти из аккаунта?') ) e.preventDefault()
    }
  })
  else links.push({
    to: '/auth',
    text: 'Войти',
    exact: false
  })

  const linksJSX = links.map((link: any) => (
    <NavLink to={link.to} exact={link.exact} className={c["menu__item"]}
      activeClassName={c['active']}
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
        toggleMenu()
        if (link.onClick) link.onClick(e)
      }}
      key={link.text}>
      {link.text}
    </NavLink>
  ))

  return (
    <header className={c['header']}>
      <NavLink to="/book" className={c["header__logo"]}><span>B</span></NavLink>
      <nav className={menuClasses.join(' ')}>
        <div className={c["menu-container"]}>
          {linksJSX}
        </div>
        <div className={c['menu__opener']} onClick={toggleMenu}><span>&times;</span></div>
        <div className={c["menu__overlay"]} onClick={toggleMenu}></div>
      </nav>
    </header>
  );
}

export default Header