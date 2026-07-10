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

// 1. Статические маршруты профиля
router.get('/profile', protect, getUserProfile)
router.put('/profile', protect, upload.single('profile_image'), updateProfile)

// 2. Маршрут для поиска
router.get('/search', protect, searchUsers)

// 3. Маршруты подписок
router.post('/follow/:id', protect, followUser)
router.post('/unfollow/:id', protect, unfollowUser)

// 4. Динамический маршрут
router.get('/:username', protect, getPublicProfile)

export default router
