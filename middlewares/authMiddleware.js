import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

export const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Remove "Bearer " and get the token itself
      token = req.headers.authorization.split(' ')[1]

      // Decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Find the user in the database
      req.user = await User.findById(decoded.userId).select('-password')

      if (!req.user) {
        return res.status(401).json({ message: 'User not found. Token is invalid.' })
      }

      next()
    } catch (error) {
      console.error(error)
      return res.status(401).json({ message: 'Not authorized, token is invalid' })
    }
  }

  if (!token) {
    return res
      .status(401).json({ message: 'Not authorized, no token' })
  }
}
