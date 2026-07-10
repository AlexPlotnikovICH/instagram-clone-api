import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: '',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true, // Без автора коммент существовать не может
        },
        text: {
          type: String,
          required: true, // Пустые комменты не нужны
        },
        createdAt: {
          type: Date,
          default: Date.now, // Дата поставится сама в момент создания
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

export default mongoose.model('Post', postSchema)
