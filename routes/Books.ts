import express from 'express'
import { JwtCheck, IRequestWithUser } from '../middlewares/Jwt'
import db from '../db/Connect'
import pgp from 'pg-promise'

const router = express.Router()

const sortes = {
  likesd: ['likes', 'desc'],
  likesu: ['likes', 'asc'],
  dated: ['createdat', 'desc'],
  dateu: ['createdat', 'asc'],
  named: ['bq.name', 'desc'],
  nameu: ['bq.name', 'asc']
}

// запрос всех книг
router.get('/', async (req: express.Request, res: express.Response) => {
  const { sort = 'likesd', search = '', limit, skip } = req.query

  let sortOptions: any = sortes[sort]
  if (!sortOptions) sortOptions = sortes['likesd']

  const searchOption = search ? "where bq.name ilike '%$5:value%' or bq.name ilike '$5:value%' " : ''
  const limitOption = limit ? limit : 15
  const skipOption = skip ? skip : 0
  const queryString = `
  select bq.id ,bq.name, createdat, bq.photo_path, bq.description, aj.name as author_name, cj.name as category_name,
  (select count(id) from book_likes bj where bq.id = bj.book_id) as likes
  from book as bq 
  join author as aj on bq.author_id = aj.id
  join categories as cj on bq.category_id = cj.id
  ${searchOption}
  order by $3:raw $4:raw, bq.name desc
  limit $1 offset $2`

  try {
    const books = await db.any(queryString,
      [
        limitOption,
        skipOption,
        sortOptions[0],
        sortOptions[1],
        search
      ]
    )

    res.json({ ok: true, data: books })
  } catch (err) {
    res.status(400).json({ ok: false, message: err })
  }
})

router.get('/categories', async (req: express.Request, res: express.Response) => {
  try {
    const categories = await db.any('select * from categories')

    res.json({ ok: true, data: categories })
  } catch (err) {
    res.status(400).json({ ok: false, message: err })
  }
})

// Запрос одной книги
router.get('/one/:id', async (req: express.Request, res: express.Response) => {
  const { id } = req.params

  if (!id) return res.status(400).json({ ok: false, message: 'Invalid request' })

  const queryString = `
    select bq.id ,bq.name, createdat, bq.photo_path, bq.description, aj.name as author_name, bq.author_id, cj.name as category_name,
    (select count(id) from book_likes bj where bq.id = bj.book_id) as likes
    from book as bq 
    join author as aj on bq.author_id = aj.id
    join categories as cj on bq.category_id = cj.id
    where bq.id = $1
  `

  try {
    const book = await db.one(queryString, [id])
    res.json({ ok: true, data: book })
  } catch (err) {
    res.status(400).json({ ok: false, message: 'Invalid request' })
  }
})

// Запрос информации по автору
router.get('/author/:id', async (req: express.Request, res: express.Response) => {
  const { id } = req.params

  if (!id) return res.status(400).json({ ok: false, message: 'Invalid request' })

  try {
    const queryStringBooks = `
      select bq.id ,bq.name, createdat, bq.photo_path, bq.description, cj.name as category_name,
      (select count(id) from book_likes bj where bq.id = bj.book_id) as likes
      from book as bq
      join categories as cj on bq.category_id = cj.id
      where author_id = $1
      order by likes desc, bq.name desc
    `
    const queryStringAuthor = `
      select * from author where id = $1
    `

    const request1 = db.query(queryStringBooks, [id])
    const request2 = db.query(queryStringAuthor, [id])

    const resultObject = {
      books: await request1,
      author: (await request2)[0]
    }

    res.json({ ok: true, data: resultObject })
  } catch (err) {
    res.status(400).json({ ok: false, message: err })
  }
})

// запрос книг по категории
router.get('/:category', async (req: express.Request, res: express.Response) => {
  const { sort, search, limit, skip } = req.query
  const category = req.params.category

  let sortOptions: any = sortes[sort]
  if (!sortOptions) sortOptions = sortes['likesd']

  const searchOption = search ? "and (bq.name ilike '%$5:value%' or bq.name ilike '$5:value%')" : ''
  const limitOption = limit ? limit : 15
  const skipOption = skip ? skip : 0
  const queryString = `
  select bq.id ,bq.name, createdat, bq.photo_path, bq.description, aj.name as author_name, cj.name as category_name,
  (select count(id) from book_likes bj where bq.id = bj.book_id) as likes
  from book as bq 
  join author as aj on bq.author_id = aj.id
  join categories as cj on bq.category_id = cj.id
  where category_id = $6:value ${searchOption}
  order by $3:raw $4:raw
  limit $1:raw offset $2:raw`


  try {
    const books = await db.any(queryString,
      [
        limitOption,
        skipOption,
        sortOptions[0],
        sortOptions[1],
        search,
        category
      ]
    )

    res.json({ ok: true, data: books })
  } catch (err) {
    res.status(400).json({ ok: false, message: err })
  }
})

// поставить лайк
router.post('/like', JwtCheck, async (req: express.Request, res: express.Response) => {
  const { id: user_id } = (req as IRequestWithUser).user
  const { book_id } = req.body

  try {
    if (!+user_id || !+book_id) return res.status(400).json({ ok: false, message: 'Invalid request' })

    const exists = await db.oneOrNone('select * from book_likes where book_id = $1 and user_id = $2', [book_id, user_id])

    if (exists) return res.json({ ok: false, message: 'like has already chosen' })

    await db.query('insert into book_likes(book_id, user_id) values ($1, $2)', [book_id, user_id])
    const correctLikes = await db.one('select count(id) from book_likes where book_id = $1 ', [book_id])

    res.json({ ok: true, correctLikes: correctLikes.count })
  } catch (err) {
    res.status(400).json({ ok: false, message: 'Error' })
  }
})

// удалить лайк
router.post('/unlike', JwtCheck, async (req: express.Request, res: express.Response) => {
  const { id: user_id } = (req as IRequestWithUser).user
  const { book_id } = req.body

  try {
    await db.query('delete from book_likes where book_id = $2 and user_id = $1', [user_id, book_id])
    const correctLikes = await db.one('select count(id) from book_likes where book_id = $1 ', [book_id])
    res.json({ ok: true, correctLikes: correctLikes.count })
  } catch (err) {
    res.status(400).json({ ok: false, message: 'Error' })
  }
})

// Запрос списка лайков для пользователя
router.post('/likes/user', JwtCheck, async (req: express.Request, res: express.Response) => {
  // id можно взять из токена
  const { id } = (req as IRequestWithUser).user

  const queryString = `
    select book_id from book_likes where user_id = $1
  `

  try {
    let likes = await db.query(queryString, id)
    likes = likes.map((likeObject: any) => likeObject.book_id)
    res.json({ ok: true, data: likes })
  } catch (err) {
    res.status(400).json({ ok: false, message: err })
  }
})

// Запрос списка книг пользователя
router.post('/user/books', JwtCheck, async (req: express.Request, res: express.Response) => {
  // id можно взять из токена
  const { id } = (req as IRequestWithUser).user
  const { skip, limit } = req.body

  const limitOption = limit ? limit : 15
  const skipOption = skip ? skip : 0

  const queryString = `
    select bj.id , bj.name, createdat, bj.photo_path, bj.description, aj.name as author_name, cj.name as category_name,
    (select count(id) as likes from book_likes bq where bj.id = bq.book_id) from book_likes lq
    join book bj on bj.id = lq.book_id 
    join categories as cj on bj.category_id = cj.id
    join author as aj on bj.author_id = aj.id
    where user_id = $1
    limit $2 offset $3 
  `

  try {
    const books = await db.query(queryString, [id, limitOption, skipOption])
    res.json({ ok: true, data: books })
  } catch (err) {
    res.status(400).json({ ok: false, message: err })
  }
})


export default router

// Выборка книги
// select bq.id ,bq.name, createdat, bq.photo_path, bq.description, aj.name as author_name, cj.name as category_name,
// (select count(id) from book_likes bj where bq.id = bj.book_id) as likes
// from book as bq 
// join author as aj on bq.author_id = aj.id
// join categories as cj on bq.category_id = cj.id
// -- where category_id = 1
// -- where bq.name ilike '%н%' or bq.name ilike 'н%'
// order by createdat desc
// limit 5 offset 0

// Загрузка книг по автору
// select bq.id ,bq.name, createdat, bq.photo_path, bq.description, cj.name as category_name,
// (select count(id) from book_likes bj where bq.id = bj.book_id) as likes
// from book as bq
// join categories as cj on bq.category_id = cj.id
// where author_id = 1
// order by likes desc

// Добавление лайка
// insert into book_likes(book_id, user_id) values (5, 3)

// Запрос автора
// select * from author where id = 1

// запрос категорий
// select * from categories

// запрос инфо по книге
// select bq.id ,bq.name, createdat, bq.photo_path, bq.description, aj.name as author_name, cj.name as category_name,
// (select count(id) from book_likes bj where bq.id = bj.book_id) as likes
// from book as bq 
// join author as aj on bq.author_id = aj.id
// join categories as cj on bq.category_id = cj.id
// where bq.id = 1

// удаление лайка
// delete from book_likes where book_id = 1 and user_id = 1

// запрос книг пользователя
// select bj.id , bj.name, createdat, bj.photo_path, bj.description, aj.name as author_name, cj.name as category_name,
//   (select count(id) from book_likes bq where bj.id = bq.book_id) from book_likes lq
// join book bj on bj.id = lq.book_id 
// join categories as cj on bj.category_id = cj.id
// join author as aj on bj.author_id = aj.id
// where user_id = 1
// limit 15 offset 0 