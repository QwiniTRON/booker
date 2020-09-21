import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import { faSearch, faAngleRight, faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { RouteComponentProps } from 'react-router'
import { NavLink, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Card from '../../components/card/Card'
import SlidePanel from '../../components/SlideMenu/SlideMenu'
import { RootState } from '../../redux/mainReducer'
import { loadFirstBooks, loadMoreBooks } from '../../redux/actions/Book'
import { IBook, ICategory } from '../../types'
import Loader from '../../components/UI/Loader/Loader'
import Button from '../../components/UI/Button/Button'

import c from './Books.module.scss'


type BookRoute = {
  category: string
}

interface BookProps extends RouteComponentProps<BookRoute> {
  [s: string]: any
  loadFirstBooks: typeof loadFirstBooks
  loadMoreBooks: typeof loadMoreBooks
  books: IBook[]
  isEnd: boolean
  isLoading: boolean
  categories: ICategory[]
  searchStatus: boolean
}

const Books: React.FC<BookProps> = function (props) {
  const [searchString, setSearchString] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const [sortOption, setSortOption] = useState('likesd')


  const category = props.match? props.match.params.category : ''
  useEffect(() => {
    let tempStr: any = decodeURI(props.location.search)
    tempStr = tempStr.replace(/\s*/ig, '')
    tempStr = tempStr.slice(1)
    tempStr = tempStr.split(',')
    tempStr = tempStr.map((i: any) => i.split('='))
    tempStr = Object.fromEntries(tempStr)

    if (tempStr.sort) setSortOption(tempStr.sort)
    if (tempStr.search) setSearchString(tempStr.search)
  }, [])

  useEffect(() => {
    let urlString = `${props.location.pathname}?sort=${sortOption}, 
      search=${searchString}`
    props.history.push(urlString)


    props.loadFirstBooks(category, searchString, sortOption, 0, 3)
  }, [category, sortOption, searchString])


  const submitHandle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSearchString(searchRef.current!.value)
  }

  const asideHelper = useRef<any>(null)

  return (
    <div className={c['books']}>
      <aside className={c['sidemenu']}>

        <SlidePanel helper={asideHelper}>
          {props.categories.map((cat) => (

            <NavLink to={'/book/' + cat.id}
              activeClassName={c['active']}
              className={c["category"]}
              key={cat.id}
              onClick={() => {
                if (asideHelper.current) {
                  asideHelper.current.close()
                }
              }}>

              <span><Fa icon={faAngleRight} /></span> {cat.name}
            </NavLink>

          ))}
        </SlidePanel>

      </aside>

      {/* <aside className={sidePanelClasses.join(' ')}>
        <div className={c["side-panel__body"]}>
          <div className={c["side-panel__category"]}><span><Fa icon={faAngleRight} /></span> cat 1</div>
          <div className={c["side-panel__category"]}><span><Fa icon={faAngleRight} /></span> cat 2</div>
          <div className={c["side-panel__category"]}><span><Fa icon={faAngleRight} /></span> cat 3</div>
          <div className={c["side-panel__category"]}><span><Fa icon={faAngleRight} /></span> cat 4</div>
        </div>
        <div onClick={(e) => { setSideMenuOpen(!sideMenuOpen) }} className={c["side-panel__opener"]}>
          <span><Fa icon={faEllipsisV} /></span>
        </div>
        <div onClick={(e) => { setSideMenuOpen(!sideMenuOpen) }} className={c["side-panel__layout"]}></div>
        <div className={c["side-panel__closer"]} onClick={(e) => { setSideMenuOpen(!sideMenuOpen) }}>&times;</div>
      </aside> */}


      <article className={c['main-content']}>
        <div className={c["filters"]}>
          <form className={c["filters__form"]} onSubmit={submitHandle}>
            <select name="sort" value={sortOption} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setSortOption(e.target.value)
            }}>
              <option value="likesd">По возрастанию лайков</option>
              <option value="likesu">По убыванию лайков</option>
              <option value="dated">По возрастанию даты написания</option>
              <option value="dateu">По убыванию даты написания</option>
              <option value="named">По возрастанию имени</option>
              <option value="nameu">По убыванию имени</option>
            </select>
            <div className={c["search-group"]}>
              <input ref={searchRef}
                className={c['search-group__input']} type="text" name="search" placeholder="название книги" />
              <button type="submit"><Fa icon={faSearch} /></button>
            </div>
          </form>
        </div>

        <div className={c["main-content__body"]}>
          {props.books.map((book, i) => (
            <Card item={book}
              to={"/aboutbook/" + book.id}
              key={book.id} />
          ))}
        </div>

        {
          props.searchStatus && <p>Ничего не нашлось ...</p>
        }

        {
          props.isLoading ? <Loader /> :
            !props.isEnd
            &&
            <Button color="load" onClick={() => {
              props.loadMoreBooks(category, searchString, sortOption, props.books.length, 3)
            }}>
              Ёще книги
            </Button>
        }

      </article>
    </div >
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    isLoading: state.book.loading,
    books: state.book.books,
    isEnd: state.book.endStatus,
    categories: state.book.categories,
    searchStatus: state.book.searchStatus
  }
}

const mapDispatchToProps = {
  loadFirstBooks,
  loadMoreBooks
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Books))