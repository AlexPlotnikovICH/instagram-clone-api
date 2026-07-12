import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from './models/userModel.js'
import Post from './models/postModel.js'
import Follow from './models/followModel.js'
import Notification from './models/notificationModel.js'

const seedDatabase = async () => {
  try {
    // 1. Connection
    await mongoose.connect(process.env.MONGO_URI)
    console.log('🚀 Database connected. Starting cleanup...')

    // 2. Clear old data
    await User.deleteMany({})
    await Post.deleteMany({})
    await Follow.deleteMany({})
    await Notification.deleteMany({})
    console.log('🧹 Collections cleared successfully.')

    // 3. Password hashing
    const salt = await bcrypt.genSalt(10)
    const commonPassword = await bcrypt.hash('123456', salt)

    // 4. Create reference users
    const users = await User.insertMany([
      {
        fullname: 'Clean Coder',
        username: 'clean_coder',
        email: 'coder@test.com',
        password: commonPassword,
        bio: 'Writing code that breathes, not smells. 💻✨',
        profile_image: 'https://i.pravatar.cc/150?u=coder',
      },
      {
        fullname: 'Design Guru',
        username: 'guru_design',
        email: 'guru@test.com',
        password: commonPassword,
        bio: 'Turning chaotic wireframes into pixel-perfect reality. 🎨📐',
        profile_image: 'https://i.pravatar.cc/150?u=design',
      },
      {
        fullname: 'Bug Hunter',
        username: 'tester_pro',
        email: 'test@test.com',
        password: commonPassword,
        bio: 'I can find a critical bug even in a basic Hello World. 🐛🔍',
        profile_image: 'https://i.pravatar.cc/150?u=test',
      },
    ])
    console.log('👤 Users seeded successfully.')

    // 5. Create posts linked to users (10 posts)
    const postData = [
      { cap: 'Code is poetry. Sometimes, it just needs a little debugging. ☕ #coding #devlife', img: 'tech' },
      { cap: 'The view right outside my WSL terminal window today. 🌲 #wsl #linux #setup', img: 'nature' },
      { cap: 'Design is not just what it looks like and feels like. Design is how it works. 💡 #uiux #webdesign', img: 'architecture' },
      { cap: 'Remember: It’s not a bug, it’s an undocumented feature. 😉 #programming #developer', img: 'animals' },
      { cap: 'Converting premium coffee into production code. Pure magic! ☕⚡ #softwareengineer #coffee', img: 'cafe' },
      { cap: 'My Acer Predator handles even the heaviest database queries like a charm. 🔥 #gamingpc #workstation', img: 'work' },
      { cap: 'That rare, beautiful moment when frontend and backend finally align. 🤝 #fullstack #webdev', img: 'people' },
      { cap: 'Friday evening deploy — a guaranteed recipe for an all-nighter. 🏙️ #devops #sysadmin', img: 'city' },
      { cap: 'Zustand is an absolute lifesaver for global state management. 🧠 #reactjs #javascript', img: 'abstract' },
      { cap: 'Building an Instagram clone. Watch out, Mark! 🚀 #buildinpublic #indiehackers', img: 'nightlife' },
    ]

    const posts = postData.map((item, index) => ({
      user: users[index % users.length]._id,
      image: `https://picsum.photos/seed/ichgram${index}/800/800`,
      caption: item.cap,
      likes: [],
      comments: [],
    }))

    await Post.insertMany(posts)
    console.log(`🖼️ Created ${posts.length} posts for various users.`)

    console.log('✅ Database staging completed successfully!')
    await mongoose.connection.close()
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding error occurred:', error)
    process.exit(1)
  }
}

seedDatabase()