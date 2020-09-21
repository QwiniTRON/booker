import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import config from 'config'

export function JwtCheck(req: Request, res: Response, next: any) {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers!.authorization!.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: "Вы не авторизованы", ok: false });
    }

    const decoded = jwt.verify(token, config.get('jwtSecret'), {});
    (req as IRequestWithUser).user = decoded;

    return next();

  } catch (e) {
    if(e.name == 'TokenExpiredError') {
      return res.status(401).json({ message: "invalid token", ok: false, tokenEnd: true });
    }
    return res.status(401).json({ message: "no token", ok: false, notoken: true });
  }
}

// ** Types **
export interface IRequestWithUser extends Request {
  user: any
}