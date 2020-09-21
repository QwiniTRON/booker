import React from 'react'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import { faHeart, faUser, faClock } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { IBook } from '../../types'

import c from './Card.module.scss'

type CardProps = {
  item: IBook
  to: string
}

const Card: React.FC<CardProps> = function ({ item, to }) {
  const name = item.name.slice! ?
    (item.name.length > 20 ? item.name.slice(0, 20) + '...' : item.name) :
    'Нет названия';
  const description = item.description.slice! ?
    (item.description.length > 150 ? item.description.slice(0, 150) + '...' : item.description) :
    'Нет описания';

  const createdat = new Date(item.createdat).toLocaleDateString('ru', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
  // const createdat = new Intl.DateTimeFormat('ru', {
  // year: 'numeric',
  // month: 'narrow',
  // day: 'numeric'
  // }).format(new Date(item.createdat))


  return (
    <div className={c['card']}>
      <div className={c["card__body"]}>
        <Link to={to} className={c['card__main-link']}>
          <div className={c["card__title"]}>{name}</div>
        </Link>
        <Link to={to} className={c['card__main-link--img']}>
          <img
            loading="lazy"
            className={c['card__img']}
            src={'/img/' + item.photo_path}
            alt={"книга " + name} />
        </Link>
        <div className={c["card__description"]}>
          {description}
        </div>
        <div className={c["card__info"]}>
          <div className={c["card__author"]}><span><Fa icon={faUser} /></span>{item.author_name}</div>
          <div className={c["card__date"]}><span><Fa icon={faClock} /></span>{createdat}</div>
          <div className={c["card__likes"]}><span><Fa icon={faHeart} /></span>{item.likes}</div>
        </div>
        <Link to={to} className={c['card__sub-link']}>Подробнее</Link>
      </div>
    </div>
  );
}

export default Card