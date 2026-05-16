import { Router } from 'express'
import prisma from '../utils/prisma'
import { authenticate, AuthRequest } from '../middleware/auth.middleware'
import { authorize } from '../middleware/role.middleware'

const router = Router()

router.get(
  '/',
  authenticate,
  authorize(['read']),
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user.id

      const content = await prisma.content.findMany({
        where: {
          assignedTo: userId
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return res.json(content)
    } catch (error) {
      console.error(error)

      return res.status(500).json({
        message: 'Server error'
      })
    }
  }
)

router.post(
  '/',
  authenticate,
  authorize(['create']),
  async (req, res) => {
    const content = await prisma.content.create({
      data: req.body
    })

    res.json(content)
  }
)

router.put(
  '/:id',
  authenticate,
  authorize(['update']),
  async (req, res) => {
    const content = await prisma.content.update({
      where: {
        id: Number(req.params.id)
      },
      data: req.body
    })

    res.json(content)
  }
)

router.delete(
  '/:id',
  authenticate,
  authorize(['delete']),
  async (req, res) => {
    await prisma.content.delete({
      where: {
        id: Number(req.params.id)
      }
    })

    res.json({ message: 'Deleted successfully' })
  }
)

export default router