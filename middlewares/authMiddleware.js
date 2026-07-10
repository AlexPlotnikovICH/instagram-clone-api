import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

export const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Отрезаем "Bearer " и берем сам токен
      token = req.headers.authorization.split(' ')[1]

      // Расшифровываем
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Ищем юзера в базе
      req.user = await User.findById(decoded.userId).select('-password')

      if (!req.user) {
        return res
          .status(401)
          .json({ message: 'Пользователь не найден. Токен недействителен.' })
      }

      next()
    } catch (error) {
      console.error(error)
      return res
        .status(401)
        .json({ message: 'Не авторизован, токен недействителен' })
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Нет авторизации, токен отсутствует' })
  }
}
