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
    res.status(500).json({ message: 'Error fetching notifications' })
  }
}

// Mark all notifications as read for the current user
export const markAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true } },
    )
    res.json({ message: 'Notifications marked as read' })
  } catch (error) {
    console.error('Error marking notifications as read:', error)
    res.status(500).json({ message: 'Error updating notification status' })
  }
}
