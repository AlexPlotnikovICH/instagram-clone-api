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
    res.status(500).json({ message: 'Ошибка при поиске пользователей' })
  }
}

export const followUser = async (req, res) => {
  try {
    const targetUserId = req.params.id
    const currentUserId = req.user._id

    if (targetUserId === currentUserId.toString()) {
      return res
        .status(400)
        .json({ message: 'Нельзя подписаться на самого себя' })
    }

    const targetUser = await User.findById(targetUserId)
    if (!targetUser) {
      return res.status(404).json({ message: 'Пользователь не найден' })
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

    res.status(201).json({ message: 'Вы успешно подписались' })
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: 'Вы уже подписаны на этого пользователя' })
    }
    console.error(error)
    res.status(500).json({ message: 'Ошибка сервера при подписке' })
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
      return res
        .status(400)
        .json({ message: 'Вы не подписаны на этого пользователя' })
    }

    await Notification.findOneAndDelete({
      recipient: targetUserId,
      sender: currentUserId,
      type: 'follow',
    })

    res.json({ message: 'Вы успешно отписались' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Ошибка сервера при отписке' })
  }
}

// --- ПЕРЕСАЖЕННЫЕ ФУНКЦИИ ПРОФИЛЯ ---

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
    res.status(404).json({ message: 'Пользователь не найден' })
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
      res.status(404).json({ message: 'Пользователь не найден' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Ошибка при обновлении профиля' })
  }
}
// Получение публичного профиля любого пользователя по username
export const getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params

    // 1. Ищем пользователя
    const user = await User.findOne({ username }).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    // 2. Считаем сколько у него подписчиков и на кого он подписан
    const followersCount = await Follow.countDocuments({ following: user._id })
    const followingCount = await Follow.countDocuments({ follower: user._id })

    // 3. Проверяем, подписан ли ТЕКУЩИЙ пользователь на этого чела
    const isFollowing = await Follow.findOne({
      follower: req.user._id,
      following: user._id,
    })

    // Собираем всё в один ответ
    res.json({
      ...user._doc,
      followersCount,
      followingCount,
      isFollowing: !!isFollowing,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Ошибка сервера при получении профиля' })
  }
}
