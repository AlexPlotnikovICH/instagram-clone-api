import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from './models/userModel.js'
import Post from './models/postModel.js'
import Follow from './models/followModel.js'
import Notification from './models/notificationModel.js'

const seedDatabase = async () => {
  try {
    // 1. Подключение
    await mongoose.connect(process.env.MONGO_URI)
    console.log('🚀 База на связи. Начинаем зачистку...')

    // 2. Очистка старых данных
    await User.deleteMany({})
    await Post.deleteMany({})
    await Follow.deleteMany({})
    await Notification.deleteMany({})
    console.log('🧹 Коллекции очищены.')

    // 3. Хеширование пароля для всех
    const salt = await bcrypt.genSalt(10)
    const commonPassword = await bcrypt.hash('123456', salt)

    // 4. Создание эталонных юзеров
    const users = await User.insertMany([
      {
        fullname: 'Clean Coder',
        username: 'clean_coder',
        email: 'coder@test.com',
        password: commonPassword,
        bio: 'Пишу код, который не пахнет.',
        profile_image: 'https://i.pravatar.cc/150?u=coder',
      },
      {
        fullname: 'Design Guru',
        username: 'guru_design',
        email: 'guru@test.com',
        password: commonPassword,
        bio: 'Делаю красиво там, где было криво.',
        profile_image: 'https://i.pravatar.cc/150?u=design',
      },
      {
        fullname: 'Bugs Hunter',
        username: 'tester_pro',
        email: 'test@test.com',
        password: commonPassword,
        bio: 'Найду ошибку даже в Hello World.',
        profile_image: 'https://i.pravatar.cc/150?u=test',
      },
    ])
    console.log('👤 Юзеры созданы.')

    // 5. Создание постов с привязкой к юзерам 10+
    const postData = [
      { cap: 'Код — это поэзия. Иногда — матерная.', img: 'tech' },
      { cap: 'Вид из окна моего WSL терминала.', img: 'nature' },
      {
        cap: 'Дизайн — это не то, как вещь выглядит, а то, как она работает.',
        img: 'architecture',
      },
      { cap: 'Баги — это просто недокументированные фичи.', img: 'animals' },
      { cap: 'Кофе превращается в код. Магия!', img: 'cafe' },
      {
        cap: 'Мой Acer Predator тянет даже самые тяжелые запросы.',
        img: 'work',
      },
      { cap: 'Когда фронтенд и бэкенд наконец-то подружились.', img: 'people' },
      { cap: 'Вечерний деплой — залог бессонной ночи.', img: 'city' },
      { cap: 'Zustand — это спасение для стейта.', img: 'abstract' },
      { cap: 'Готовлю клон инсты. Марк, подвинься!', img: 'nightlife' },
    ]

    const posts = postData.map((item, index) => ({
      user: users[index % users.length]._id,
      image: `https://picsum.photos/seed/ichgram${index}/800/800`,
      caption: item.cap,
      likes: [],
      comments: [],
    }))

    await Post.insertMany(posts)
    console.log(`🖼 Создано ${posts.length} постов для разных пользователей.`)

    console.log('✅ Стейджинг базы завершен успешно!')
    await mongoose.connection.close()
    process.exit(0)
  } catch (error) {
    console.error('❌ Ошибка сидинга:', error)
    process.exit(1)
  }
}

seedDatabase()
