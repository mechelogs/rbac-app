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
      const userId = req.user!.id

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
  async (req: AuthRequest, res) => {
    try {
      const { title, body } = req.body as {
        title?: string
        body?: string
      }

      if (!title || !body) {
        return res.status(400).json({
          message: 'Title and body are required'
        })
      }

      const content = await prisma.content.create({
        data: {
          title,
          body,
          assignedTo: req.user!.id
        }
      })

      return res.json(content)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Server error' })
    }
  }
)

router.put(
  '/:id',
  authenticate,
  authorize(['update']),
  async (req: AuthRequest, res) => {
    try {
      const contentId = Number(req.params.id)

      if (Number.isNaN(contentId)) {
        return res.status(400).json({ message: 'Invalid content id' })
      }

      const existing = await prisma.content.findUnique({
        where: { id: contentId }
      })

      if (!existing) {
        return res.status(404).json({ message: 'Content not found' })
      }

      if (existing.assignedTo !== req.user!.id) {
        return res.status(403).json({ message: 'Forbidden' })
      }

      const { title, body } = req.body as {
        title?: string
        body?: string
      }

      if (!title && !body) {
        return res.status(400).json({
          message: 'At least one field is required'
        })
      }

      const content = await prisma.content.update({
        where: { id: contentId },
        data: {
          title: title ?? existing.title,
          body: body ?? existing.body
        }
      })

      return res.json(content)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Server error' })
    }
  }
)

router.delete(
  '/:id',
  authenticate,
  authorize(['delete']),
  async (req: AuthRequest, res) => {
    try {
      const contentId = Number(req.params.id)

      if (Number.isNaN(contentId)) {
        return res.status(400).json({ message: 'Invalid content id' })
      }

      const existing = await prisma.content.findUnique({
        where: { id: contentId }
      })

      if (!existing) {
        return res.status(404).json({ message: 'Content not found' })
      }

      if (existing.assignedTo !== req.user!.id) {
        return res.status(403).json({ message: 'Forbidden' })
      }

      await prisma.content.delete({
        where: { id: contentId }
      })

      return res.json({ message: 'Deleted successfully' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Server error' })
    }
  }
)

export default router