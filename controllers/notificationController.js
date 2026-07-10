import Notification from '../models/notificationModel.js'

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('sender', 'username profile_image')
      .populate('post', 'image')

    res.json(notifications)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Ошибка при получении уведомлений' })
  }
}

// НОВАЯ ФУНКЦИЯ: Сброс статуса (гасим красную точку)
export const markAsRead = async (req, res) => {
  try {
    // Находим все непрочитанные уведомления текущего юзера и ставим isRead: true
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true } },
    )
    res.json({ message: 'Уведомления прочитаны' })
  } catch (error) {
    console.error('Ошибка при сбросе уведомлений:', error)
    res.status(500).json({ message: 'Ошибка при обновлении статуса' })
  }
}
