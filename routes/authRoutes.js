import express from 'express'
import rateLimit from 'express-rate-limit'
import { registerUser, loginUser, demoLogin } from '../controllers/authController.js'

const router = express.Router()

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { message: 'Too many requests, please try again after 15 minutes' }
})

router.post('/register', authLimiter, registerUser)
router.post('/login', authLimiter, loginUser)
router.post('/demo-login', demoLogin)

export default router