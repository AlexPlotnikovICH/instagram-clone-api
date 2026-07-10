import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import generateToken from '../utils/generateToken.js'

export const registerUser = async (req, res) => {
  try {
    const { email, username, fullname, password } = req.body

    // 1. ЖЕСТКАЯ ВАЛИДАЦИЯ
    if (!email || !username || !fullname || !password) {
      return res.status(400).json({ message: 'Пожалуйста, заполните все поля' })
    }

    // 2. ПРОВЕРКА НА ДУБЛИКАТЫ
    const userExists = await User.findOne({ $or: [{ email }, { username }] })
    if (userExists) {
      return res.status(400).json({
        message: 'Пользователь с таким email или username уже существует',
      })
    }

    // 3. ХЭШИРОВАНИЕ ПАРОЛЯ
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // 4. СОХРАНЕНИЕ В БАЗУ
    const user = await User.create({
      fullname,
      username,
      email,
      password: hashedPassword,
    })

    // 5. ОТВЕТ КЛИЕНТУ  Добавлен токен!
    res.status(201).json({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      bio: user.bio || '',
      profile_image: user.profile_image || '',
      token: generateToken(user._id),
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Ошибка сервера при регистрации' })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Пожалуйста, заполните все поля' })
    }

    // Хотфикс от фронтенда: гибкий поиск
    const user = await User.findOne({
      $or: [{ email: email }, { username: email }],
    })

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        bio: user.bio || '',
        profile_image: user.profile_image || '', 
        token: generateToken(user._id),
      })
    } else {
      res.status(401).json({ message: 'Неверный email или пароль' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Ошибка сервера при авторизации' })
  }
}
