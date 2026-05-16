import { Response, NextFunction } from 'express'
import { AuthRequest } from './auth.middleware'

export const authorize = (allowedPermissions: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const userPermissions = req.user?.permissions

    if (!Array.isArray(userPermissions)) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    const hasPermission = allowedPermissions.some((permission) =>
      userPermissions.includes(permission)
    )

    if (!hasPermission) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    next()
  }
}