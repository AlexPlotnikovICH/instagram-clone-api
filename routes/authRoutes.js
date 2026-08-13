import express from 'express'
import rateLimit from 'express-rate-limit'
import { registerUser, loginUser } from '../controllers/authController.js'

const router = express.Router()

// Limit each IP to 5 requests per windowMs (15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
})

// Apply limiter to auth routes
router.post('/register', authLimiter, registerUser)
router.post('/login', authLimiter, loginUser)

export default router