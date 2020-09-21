import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import { faHeart, faUser, faClock, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { RootState } from '../../redux/mainReducer'
import { loadOneBookInfo } from '../../redux/actions/Book'
import Loader from '../../components/UI/Loader/Loader'
import { IBook, IBookWithAuhtorID } from '../../types'
import { s, S } from '../../utils/Utils'
import Modal from '../../components/UI/Modal/Modal'
import { isFirstBookLiked } from '../../redux/reselect/Book'
import { likeBook, unlikeBook } from '../../redux/actions/User'
import Divider from '../../components/UI/Divider/Divider'

import c from './AboutBook.module.scss'

type AboutBookRoute = {
  id: string
}

interface AboutBookProps extends RouteComponentProps<AboutBookRoute> {
  loadOneBookInfo: typeof loadOneBookInfo
  isLoading: boolean
  book: IBookWithAuhtorID
  isAuth: boolean
  isLiked: boolean
  isInit: boolean
  likeBook: typeof likeBook
  unlikeBook: typeof unlikeBook
}

const AboutBook: React.FC<AboutBookProps> = function (props) {
  const [isNoticeModalOpen, setNoticeModalOpen] = useState(false)

  const bookId = props.match ? props.match.params.id : null
  useEffect(() => {
    if (bookId) {
      props.loadOneBookInfo(bookId)
    }
  }, [])

  const likeBlockClasses = S(c["likeblock"])
  if (props.isLiked) likeBlockClasses.add(c['liked'])

  const isCorrectBook = !props.isLoading && props.book
  const isNotCorrectBook = !props.isLoading && !props.book
  let createdat
  if (isCorrectBook) {
    createdat = new Intl.DateTimeFormat('ru', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(props.book.createdat))
  }

  const likeHandle = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!props.isAuth) {
      return setNoticeModalOpen(true)
    }

    if (props.isLiked) {
      props.unlikeBook(String(props.book.id))
    } else {
      props.likeBook(String(props.book.id))
    }
  }

  return (
    <div className={c['about-book']}>
      { props.isLoading && <Loader color="green" />}

      {isCorrectBook &&
        <div className={c["about-book__body"]}>

          <div className={c["info"]}>
            <div className={c["info__photo"]}>
              <img src={"/img/" + props.book.photo_path} alt={"книга" + props.book.name} />
            </div>
            <div className={c["info__data"]}>
              <h2 className={c['info__name']}>{props.book.name}</h2>

              <div className={s(c['info__category'], c['info__item'])}>
                <span><Fa icon={faAngleRight} /></span> категория: {props.book.category_name}
              </div>

              <div className={s(c['info__author'], c['info__item'])}>
                <span><Fa icon={faUser} /></span>
                Автор: <Link to={'/author/' + props.book.author_id}> {props.book.author_name}</Link>
              </div>

              <div className={s(c['info__createdate'], c['info__item'])}>
                <span><Fa icon={faClock} /></span> {createdat}
              </div>

              <div className={s(c['info__like'], c['info__item'])} onClick={likeHandle}>
                <div className={likeBlockClasses()}>
                  <Fa icon={faHeart} />
                </div>
                {props.book.likes}
              </div>
            </div>
          </div>

          <Divider />

          <div className={c["description"]}>
            {props.book.description}
          </div>


          <CSSTransition in={isNoticeModalOpen} timeout={500} classNames={"modal-scvig"}>
            <Modal clickHandle={() => setNoticeModalOpen(!isNoticeModalOpen)}>
              <p>Для добавления в избранное нужно авторизироваться!</p>
              <Link to="/auth" className={c['link']}>
                Войти!
              </Link>
            </Modal>
          </CSSTransition>
        </div>
      }

      {isNotCorrectBook && <div>Ошибка, попробуйте позже.</div>}
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({
  isLoading: state.book.loading,
  book: state.book.books[0],
  isAuth: !!state.auth.accessToken,
  isLiked: isFirstBookLiked(state),
  isInit: state.INIT.isInit
})

const mapDispatchToProps = {
  loadOneBookInfo,
  likeBook,
  unlikeBook
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AboutBook))