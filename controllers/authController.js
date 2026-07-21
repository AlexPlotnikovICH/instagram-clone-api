import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import generateToken from '../utils/generateToken.js'

export const registerUser = async (req, res) => {
  try {
    const { email, username, fullname, password } = req.body

    // 1. Strict validation
    if (!email || !username || !fullname || !password) {
 return res.status(400).json({ message: 'Please fill in all fields' })
    }

    // 2. Check for duplicates
    const userExists = await User.findOne({ $or: [{ email }, { username }] })
    if (userExists) {
      return res.status(400).json({
 message: 'User with this email or username already exists',
      })
    }

    // 3. Password hashing
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // 4. Save to database
    const user = await User.create({
      fullname,
      username,
      email,
      password: hashedPassword,
    })

    // 5. Respond to client with token
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
    res.status(500).json({ message: 'Server error during registration' })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
 return res.status(400).json({ message: 'Please fill in all fields' })
    }

    // Frontend hotfix: flexible search (allows login with email or username)
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
      res.status(401).json({ message: 'Invalid email or password' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error during authentication' })
  }
}
