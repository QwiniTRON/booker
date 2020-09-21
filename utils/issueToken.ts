import jwt from 'jsonwebtoken'
import config from 'config'

export default (data: any) => jwt.sign(data, config.get('jwtSecret'))