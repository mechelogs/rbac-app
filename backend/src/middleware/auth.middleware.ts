import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

export interface UserJwtPayload extends JwtPayload {
  id: number
  role: string
  permissions: string[]
}

export interface AuthRequest extends Request {
  user?: UserJwtPayload
}

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not configured')
  }
  return secret
}

const isUserJwtPayload = (value: unknown): value is UserJwtPayload => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const payload = value as Record<string, unknown>

  return (
    typeof payload.id === 'number' &&
    typeof payload.role === 'string' &&
    Array.isArray(payload.permissions) &&
    payload.permissions.every((permission) => typeof permission === 'string')
  )
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      message: 'Unauthorized'
    })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, getJwtSecret())

    if (!isUserJwtPayload(decoded)) {
      return res.status(401).json({
        message: 'Invalid token payload'
      })
    }

    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid token'
    })
  }
}