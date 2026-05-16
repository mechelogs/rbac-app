import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../utils/prisma'

const router = Router()


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true }
    })

    if (!user) {
      return res.status(400).json({
        message: 'Invalid credentials'
      })
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    )

    if (!validPassword) {
      return res.status(400).json({
        message: 'Invalid credentials'
      })
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role.name,
        permissions: user.role.permissions.split(',')
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: '1d'
      }
    )

    return res.json({ token })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      message: 'Server error'
    })
  }
})

export default router