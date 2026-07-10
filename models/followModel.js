import mongoose from 'mongoose'

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Жесткая блокировка двойных подписок на уровне БД
followSchema.index({ follower: 1, following: 1 }, { unique: true })

export default mongoose.model('Follow', followSchema)
