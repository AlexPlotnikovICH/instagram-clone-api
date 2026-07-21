import express from 'express'
import {
  searchUsers,
  followUser,
  unfollowUser,
  getUserProfile,
  updateProfile,
  getPublicProfile,
} from '../controllers/userController.js'
import { protect } from '../middlewares/authMiddleware.js'
import { upload } from '../middlewares/uploadMiddleware.js'

const router = express.Router()

// Profile routes
router.get('/profile', protect, getUserProfile)
router.put('/profile', protect, upload.single('profile_image'), updateProfile)

// Search route
router.get('/search', protect, searchUsers)

// Follow/unfollow routes
router.post('/follow/:id', protect, followUser)
router.post('/unfollow/:id', protect, unfollowUser)

// Dynamic route for public profile
router.get('/:username', protect, getPublicProfile)

export default router
