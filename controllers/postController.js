import Post from '../models/postModel.js'
import Notification from '../models/notificationModel.js'

// 1. СОЗДАНИЕ ПОСТА
export const createPost = async (req, res) => {
  try {
    const { caption } = req.body

    if (!req.file) {
      return res
        .status(400)
        .json({ message: 'Пожалуйста, прикрепите изображение' })
    }

    // Конвертация в Base64
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`

    const post = await Post.create({
      user: req.user._id,
      image: base64Image,
      caption,
    })

    res.status(201).json(post)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Ошибка сервера при создании поста' })
  }
}

// 2. ПОЛУЧЕНИЕ ВСЕХ ПОСТОВ (ЛЕНТА)
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('user', 'fullname username profile_image')
      .populate('comments.user', 'username profile_image')
    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении постов' })
  }
}

// 3. ПОЛУЧЕНИЕ ПОСТОВ КОНКРЕТНОГО ЮЗЕРА
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params
    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('user', 'fullname username profile_image')
      .populate('comments.user', 'username profile_image')

    res.json(posts)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Ошибка при получении постов пользователя' })
  }
}

// 4. УДАЛЕНИЕ ПОСТА
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' })
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Вы не можете удалить чужой пост' })
    }

    // Удаляем все уведомления, связанные с этим постом
    await Notification.deleteMany({ post: post._id })

    // А теперь удаляем сам пост
    await post.deleteOne()

    res.json({ message: 'Пост и связанные уведомления удалены' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Ошибка сервера при удалении поста' })
  }
}

// 5. ЛАЙК / ДИЗЛАЙК
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' })
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
    res.status(500).json({ message: 'Ошибка сервера при обработке лайка' })
  }
}

// 6. ДОБАВЛЕНИЕ КОММЕНТАРИЯ
export const addComment = async (req, res) => {
  try {
    const { text } = req.body
    if (!text)
      return res.status(400).json({ message: 'Текст комментария обязателен' })

    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ message: 'Пост не найден' })

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

    // Перед отправкой ответа подтягиваем данные юзера в только что созданном комменте
    await post.populate('comments.user', 'username profile_image')

    res.status(201).json(post.comments)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Ошибка сервера при добавлении комментария' })
  }
}

// 7. РЕКОМЕНДАЦИИ (EXPLORE)
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
    res
      .status(500)
      .json({ message: 'Ошибка при формировании ленты рекомендаций' })
  }
}
// 8. УДАЛЕНИЕ КОММЕНТАРИЯ
export const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params

    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' })
    }

    const comment = post.comments.find(c => c._id.toString() === commentId)
    if (!comment) {
      return res.status(404).json({ message: 'Комментарий не найден' })
    }

    // Проверка прав: ты должен быть либо автором коммента, либо автором поста
    if (
      comment.user.toString() !== req.user._id.toString() &&
      post.user.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: 'Нет прав на удаление комментария' })
    }

    // Удаляем коммент из массива
    post.comments = post.comments.filter(c => c._id.toString() !== commentId)
    await post.save()

    //удаляем уведомление об этом комменте
    await Notification.findOneAndDelete({
      sender: comment.user,
      recipient: post.user,
      type: 'comment',
      post: id,
    })

    // Возвращаем обновленный массив комментов
    await post.populate('comments.user', 'username profile_image')
    res.json(post.comments)
  } catch (error) {
    console.error('Ошибка удаления комментария:', error)
    res.status(500).json({ message: 'Ошибка сервера при удалении комментария' })
  }
}
