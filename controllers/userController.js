import User from '../models/userModel.js'
import Follow from '../models/followModel.js'
import Notification from '../models/notificationModel.js'

export const searchUsers = async (req, res) => {
  try {
    const keyword = req.query.query

    if (!keyword) {
      return res.json([])
    }

    const users = await User.find({
      $or: [
        { username: { $regex: keyword, $options: 'i' } },
        { fullname: { $regex: keyword, $options: 'i' } },
      ],
    })
      .select('username fullname profile_image bio')
      .limit(10)

    res.json(users)
  } catch (error) {
    console.error('Search error:', error)
    res.status(500).json({ message: 'Error searching for users' })
  }
}

export const followUser = async (req, res) => {
  try {
    const targetUserId = req.params.id
    const currentUserId = req.user._id

    if (targetUserId === currentUserId.toString()) {
      return res
        .status(400)
        .json({ message: 'You cannot follow yourself' })
    }

    const targetUser = await User.findById(targetUserId)
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    await Follow.create({
      follower: currentUserId,
      following: targetUserId,
    })
    await Notification.create({
      recipient: targetUserId,
      sender: currentUserId,
      type: 'follow',
    })

    res.status(201).json({ message: 'Successfully followed user' })
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: 'You are already following this user' })
    }
    console.error(error)
    res.status(500).json({ message: 'Server error during follow operation' })
  }
}

export const unfollowUser = async (req, res) => {
  try {
    const targetUserId = req.params.id
    const currentUserId = req.user._id

    const deletedFollow = await Follow.findOneAndDelete({
      follower: currentUserId,
      following: targetUserId,
    })

    if (!deletedFollow) {
      return res.status(400).json({ message: 'You are not following this user' })
    }

    await Notification.findOneAndDelete({
      recipient: targetUserId,
      sender: currentUserId,
      type: 'follow',
    })

    res.json({ message: 'Successfully unfollowed user' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error during unfollow operation' })
  }
}

export const getUserProfile = async (req, res) => {
  if (req.user) {
    res.json({
      _id: req.user._id,
      fullname: req.user.fullname,
      username: req.user.username,
      email: req.user.email,
      profile_image: req.user.profile_image,
      bio: req.user.bio,
    })
  } else {
    res.status(404).json({ message: 'User not found' })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (user) {
      user.fullname = req.body.fullname || user.fullname
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio
      user.website =
        req.body.website !== undefined ? req.body.website : user.website

      if (req.file) {
        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
        user.profile_image = base64Image
      }

      const updatedUser = await user.save()

      res.json({
        _id: updatedUser._id,
        fullname: updatedUser.fullname,
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
        website: updatedUser.website,
        profile_image: updatedUser.profile_image,
      })
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error updating profile' })
  }
}
// Get public profile of any user by username
export const getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params

    // 1. Find the user
    const user = await User.findOne({ username }).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // 2. Count followers and following
    const followersCount = await Follow.countDocuments({ following: user._id })
    const followingCount = await Follow.countDocuments({ follower: user._id })

    // 3. Check if the current user is following this user
    const isFollowing = await Follow.findOne({
      follower: req.user._id,
      following: user._id,
    })

    res.json({
      ...user._doc,
      followersCount,
      followingCount,
      isFollowing: !!isFollowing,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error while fetching profile' })
  }
}
