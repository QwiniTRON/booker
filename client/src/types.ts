// Общий вид книги
export interface IBook {
  author_name: string
  category_name: string
  createdat: Date | string
  description: string
  id: number
  likes: string
  name: string
  photo_path: string
}

// для ссылок
export interface IBookWithAuhtorID extends IBook {
  author_id: string
}

// вид категории
export interface ICategory {
  id: string
  name: string
}

// вид автора
export interface IAuthor {
  id: string
  description: string
  name: string
  photo_path: string
}