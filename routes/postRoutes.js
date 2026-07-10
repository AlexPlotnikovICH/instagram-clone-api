import express from 'express'
import {
  createPost,
  deletePost,
  getPosts,
  getUserPosts,
  toggleLike,
  addComment,
  getExplorePosts,
  deleteComment,
} from '../controllers/postController.js'
import { protect } from '../middlewares/authMiddleware.js'
import { upload } from '../middlewares/uploadMiddleware.js'

const router = express.Router()

// Специфичные маршруты ставим выше
router.get('/explore', protect, getExplorePosts)

// Маршрут для получения постов конкретного юзера (для страницы Profile)
router.get('/user/:userId', getUserPosts)

// Марш. для получения всех постов (для ленты Home)
router.get('/', getPosts)

// Марш. создания поста. защита + загрузка одного файла с полем 'image'.
router.post('/', protect, upload.single('image'), createPost)

// Марш. удаления. DELETE, protect.
router.delete('/:id', protect, deletePost)

// Марш. для лайка/дизлайка. PUT.
router.put('/:id/like', protect, toggleLike)

// Марш. для добавления комментария.
router.post('/:id/comment', protect, addComment)
// Марш. для удаления комментария. DELETE.
router.delete('/:id/comment/:commentId', protect, deleteComment)

export default router
