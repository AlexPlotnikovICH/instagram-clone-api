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

// Specific routes should be placed higher
router.get('/explore', protect, getExplorePosts)

// Route to get posts for a specific user (for the Profile page)
router.get('/user/:userId', getUserPosts)

// Route to get all posts (for the Home feed)
router.get('/', getPosts)

// Route for creating a post. Protected and handles single file upload with field 'image'.
router.post('/', protect, upload.single('image'), createPost)

// Route for deleting a post. DELETE, protected.
router.delete('/:id', protect, deletePost)

// Route for liking/unliking a post. PUT.
router.put('/:id/like', protect, toggleLike)

// Route for adding a comment.
router.post('/:id/comment', protect, addComment)
// Route for deleting a comment. DELETE.
router.delete('/:id/comment/:commentId', protect, deleteComment)

export default router
