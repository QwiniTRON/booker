import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { RootState } from '../../redux/mainReducer'
import { s } from '../../utils/Utils'
import Loader from '../../components/UI/Loader/Loader'
import { RouteComponentProps } from 'react-router'
import {withRouter} from 'react-router-dom'
import { loadAuthorData } from '../../redux/actions/Author'
import { IAuthor, IBook } from '../../types'
import Card from '../../components/card/Card'
import Divider from '../../components/UI/Divider/Divider'

import c from './Author.module.scss'

type AuthorRoute = {
  id: string
}

interface AuthorPorps extends RouteComponentProps<AuthorRoute> {
  loadAuthorData: typeof loadAuthorData
  isLoading: boolean
  books: IBook[]
  info: IAuthor
}

const Author: React.FC<AuthorPorps> = function (props) {
  console.log(props);

  const id = props.match? props.match.params.id : null

  useEffect(() => {
    if (id) props.loadAuthorData(id)
  }, [id])

  return (
    <div className={c['author']}>
      <div className={c["photo"]}>
        <img src={'/img/' + props.info.photo_path} alt={props.info.name} />
      </div>
      <h2 className={c["name"]}>
        {props.info.name}
      </h2>

      <div className={c["wrapper"]}>
        <div className={c["description"]}>
          {props.info.description}
        </div>

        <Divider />

        <div className={c["author__body"]}>
          {props.books.map((book, i) => (
            <Card item={book}
              to={"/aboutbook/" + book.id}
              key={book.id} />
          ))}
        </div>
      </div>

      {props.isLoading && <Loader color="red" />}
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({
  isLoading: state.author.isLoading,
  books: state.author.books,
  info: state.author.authorInfo
})

const mapDispatchToProps = {
  loadAuthorData
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Author))