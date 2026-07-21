import Post from '../models/postModel.js'
import Notification from '../models/notificationModel.js'

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { caption } = req.body

    if (!req.file) {
 return res.status(400).json({ message: 'Please attach an image' })
    }

    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`

    const post = await Post.create({
      user: req.user._id,
      image: base64Image,
      caption,
    })

    res.status(201).json(post)
  } catch (error) {
 console.error(error)
    res.status(500).json({ message: 'Server error while creating post' })
  }
}

// Get all posts (feed)
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('user', 'fullname username profile_image')
      .populate('comments.user', 'username profile_image')
    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' })
  }
}

// Get posts for a specific user
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params
    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('user', 'fullname username profile_image')
      .populate('comments.user', 'username profile_image')

    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user posts' })
  }
}

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    if (post.user.toString() !== req.user._id.toString()) {
      // Only the post owner can delete their post
      return res.status(403).json({
 message: 'You are not authorized to delete this post',
      })
    }

    await Notification.deleteMany({ post: post._id })

    await post.deleteOne()

    res.json({ message: 'Post and associated notifications deleted' })
  } catch (error) {
 console.error(error)
    res.status(500).json({ message: 'Server error while deleting post' })
  }
}

// Toggle like/unlike on a post
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const isLiked = post.likes.some(
      id => id.toString() === req.user._id.toString(),
    )

    if (isLiked) {
      post.likes = post.likes.filter(
        id => id.toString() !== req.user._id.toString(),
      )

      await Notification.findOneAndDelete({
        recipient: post.user,
        sender: req.user._id,
        type: 'like',
        post: post._id,
      })
    } else {
      post.likes.push(req.user._id)

      if (post.user.toString() !== req.user._id.toString()) {
        await Notification.create({
          recipient: post.user,
          sender: req.user._id,
          type: 'like',
          post: post._id,
        })
      }
    }

    await post.save()
    res.json(post.likes)
  } catch (error) {
 console.error(error)
    res.status(500).json({ message: 'Server error while processing like' })
  }
}

// Add a comment to a post
export const addComment = async (req, res) => {
  try {
    const { text } = req.body
    if (!text)
      return res.status(400).json({ message: 'Comment text is required' })

    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ message: 'Post not found' })

    const newComment = {
      user: req.user._id,
      text: text,
    }

    post.comments.push(newComment)

    if (post.user.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: post.user,
        sender: req.user._id,
        type: 'comment',
        post: post._id,
      })
    }

    await post.save()

    // Populate user data for the newly created comment before sending the response
    await post.populate('comments.user', 'username profile_image')

    res.status(201).json(post.comments)
  } catch (error) {
    res.status(500).json({ message: 'Server error while adding comment' })
  }
}

// Get posts for the explore feed
export const getExplorePosts = async (req, res) => {
  try {
    const posts = await Post.aggregate([{ $sample: { size: 20 } }])

    const populatedPosts = await Post.populate(posts, {
      path: 'user',
      select: 'username fullname profile_image',
    })

    res.json(populatedPosts)
  } catch (error) {
 console.error(error)
    res.status(500).json({ message: 'Error generating explore feed' })
  }
}
// Delete a comment from a post
export const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params

    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const comment = post.comments.find(c => c._id.toString() === commentId)
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    // Permission check: User must be either the comment author or the post author
    if (
      comment.user.toString() !== req.user._id.toString() &&
      post.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
 message: 'You do not have permission to delete this comment',
      })
    }

    // Remove the comment from the array
    post.comments = post.comments.filter(c => c._id.toString() !== commentId)
    await post.save()

    // Delete the notification associated with this comment
    await Notification.findOneAndDelete({
      sender: comment.user,
      recipient: post.user,
      type: 'comment',
      post: id,
    })

    // Return the updated array of comments
    await post.populate('comments.user', 'username profile_image')
    res.json(post.comments)
  } catch (error) {
 console.error('Error deleting comment:', error)
    res.status(500).json({ message: 'Server error while deleting comment' })
  }
}
