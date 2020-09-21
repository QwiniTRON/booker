import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Button from '../../components/UI/Button/Button'
import { RootState } from '../../redux/mainReducer'
import { loadFirstUserBook, loadMoreUserBook } from '../../redux/actions/User'
import Card from '../../components/card/Card'
import { IBook } from '../../types'
import Loader from '../../components/UI/Loader/Loader'

import c from './UserBooks.module.scss'
import { Link } from 'react-router-dom'

type UserBooksPorps = {
  loadMoreUserBook: typeof loadMoreUserBook
  loadFirstUserBook: typeof loadFirstUserBook
  books: IBook[]
  isLoading: boolean
  endStatus: boolean
  isInit: boolean
  isAuthToken: boolean
}

const UserBooks: React.FC<UserBooksPorps> = function (props) {
  useEffect(() => {
    if (props.isInit && props.isAuthToken) props.loadFirstUserBook(3)
  }, [props.isInit])

  if (props.isInit && !props.isAuthToken) return (
    <div className={c['mybooks']}>
      <h2>Ваши книги</h2>
      <p>Для просмотра книг нужно войти!</p>
      <Link to="/auth">
        Войти!
      </Link>
    </div>
  )

  return (
    <div className={c['mybooks']}>
      <h2>Ваши книги</h2>
      <div className={c['body']}>
        {props.books.map((book, i) => (
          <Card item={book}
            to={"/aboutbook/" + book.id}
            key={book.id} />
        ))}
      </div>

      {props.isLoading && <Loader color="gold" />}

      {!props.isLoading && !props.endStatus &&
        <Button color={"load"} onClick={() => {
          props.loadMoreUserBook(3, props.books.length)
        }}>
          Загрузить ещё
        </Button>
      }
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({
  books: state.user.books,
  isLoading: state.user.isLoading,
  endStatus: state.user.endStatus,
  isAuthToken: state.auth.accessToken,
  isInit: state.INIT.isInit
})

const mapDispatchToProps = {
  loadFirstUserBook,
  loadMoreUserBook
}

export default connect(mapStateToProps, mapDispatchToProps)(UserBooks)