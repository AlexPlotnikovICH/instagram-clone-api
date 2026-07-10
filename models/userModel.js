import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    profile_image: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model('User', userSchema)
