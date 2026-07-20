import { Router } from 'express'
import Groq from 'groq-sdk'

const router = Router()

// Groq SDK
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Поле message обязательно для заполнения' })
    }

    console.log('1. Отправляем запрос к Groq...')

    // API Groq
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
  content: "You are 'Ichgram AI Business Assistant', an expert in SMM, copywriting, and customer service for Instagram. CRITICAL RULE: You must always respond in the exact same language as the user's input. If the user writes in German, reply in German. If Russian, reply in Russian. Keep responses structured, concise, and use relevant emojis. Format your output using Markdown."
},
        {
          role: 'user',
          content: message
        }
      ],
      model: 'llama-3.3-70b-versatile',
    })

    console.log('2. Ответ от Groq получен!')

    // Достаем текст ответа
    const text = chatCompletion.choices[0]?.message?.content || ''

    // Возвращаем ответ в требуемом формате
    return res.json({ reply: text })

  } catch (error) {
    console.error('Groq API Error:', error)
    return res.status(500).json({ error: 'Ошибка при обработке запроса к AI' })
  }
})

export default router