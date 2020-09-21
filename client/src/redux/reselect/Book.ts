import {createSelector} from 'reselect'
import { IBook } from '../../types';
import { RootState } from '../mainReducer';

function getFirstBook(state: RootState) {
  return state.book.books[0]
}

export const getFirstBookSelector = createSelector(
  getFirstBook,
  (firstBook: IBook) => {
    return firstBook
  }
)

export const getFirstBookLikesSelector = createSelector(
  getFirstBook,
  (firstBook: IBook) => {
    return firstBook.likes
  }
)

export const isFirstBookLiked = createSelector(
  (state: RootState) => state.book.books[0],
  (state: RootState) => state.user.likes,
  (firstBook: IBook, likes: any[]) => {
    if(!firstBook) return false
    return likes.includes(firstBook.id)
  }
)