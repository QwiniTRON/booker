import express = require('express')
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import config from 'config'
import { validationResult, body } from 'express-validator'
import db from '../db/Connect'
import { IPerson } from '../db/Types'
import { loginValidator, registerValidator } from '../utils/Validators'
import {JwtCheck} from '../middlewares/Jwt'

const router = express.Router()
const secretKey: string = config.get('jwtSecret')


// login
router.post('/login', loginValidator, async (req: express.Request, res: express.Response) => {
  const { email, password } = req.body

  const results = validationResult(req)
  if (!results.isEmpty()) {
    return res.status(403).json({
      ok: false, message: results.array()[0].msg
    })
  }


  const candidate: IPerson | null = await db.oneOrNone('select * from person where email = $1', email)

  if (!candidate || !bcrypt.compareSync(password, candidate.password)) {
    return res.status(403).json({ ok: false, error: 'Неверные данные логин или пароль' })
  }


  const accessToken = jwt.sign({
    id: candidate.id,
    type: 'ACCESS'
  }, secretKey, { expiresIn: config.get('jwtAccessTokenLife') })

  const refreshToken = jwt.sign({
    id: candidate.id,
    type: 'REFRESH'
  }, secretKey, { expiresIn: config.get('jwtRefreshTokenLife') })

  res.json({
    refreshToken,
    token: accessToken,
    ok: true
  })
})


// register
router.post('/register', registerValidator, async (req: express.Request, res: express.Response) => {
  let { email, password, passwordr, nickname } = req.body

  const results = validationResult(req)
  if (!results.isEmpty()) {
    return res.status(403).json({
      ok: false, message: results.array()[0].msg
    })
  }

  password = bcrypt.hashSync(password, 12)

  try {
    await db.query('insert into person(nickname, email, password) values ($1, $3, $2)', [nickname, password, email])
    res.json({ok: true, register: true})
  } catch (err) {
    res.status(400).json({ok: false, message: err.name})
  }
})

// check token
router.post('/check', JwtCheck, async (req: express.Request, res: express.Response) => {
  res.json({ok: true})
})

// refresh token
router.post('/refresh', async (req: express.Request, res: express.Response) => {
  const { refreshToken: refreshTokenClient } = req.body

  try {
    const decoded: Itoken = jwt.verify(refreshTokenClient, config.get('jwtSecret')) as Itoken;

    if (decoded.type !== 'REFRESH') return res.status(400).json({ ok: false, message: 'Invalid token!' })


    const accessToken = jwt.sign({
      id: decoded.id,
      type: 'ACCESS'
    }, secretKey, { expiresIn: config.get('jwtAccessTokenLife') })

    const refreshToken = jwt.sign({
      id: decoded.id,
      type: 'REFRESH'
    }, secretKey, { expiresIn: config.get('jwtRefreshTokenLife') })

    return res.json({
      refreshToken,
      token: accessToken,
      ok: true
    })
  } catch (err) {

    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired!", ok: false, tokenEnd: true });
    } else if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token!", ok: false });
    }
  }
})

export default router

// ** types **
interface Itoken {
  type: 'REFRESH' | 'ACCESS',
  id: number
}