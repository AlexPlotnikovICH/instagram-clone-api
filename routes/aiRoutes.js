import { Router } from 'express'
import Groq from 'groq-sdk'

const router = Router()

// Инициализация Groq SDK
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body

    // Валидация входящих данных
    if (!message) {
      return res.status(400).json({ error: 'Поле message обязательно для заполнения' })
    }

    console.log('1. Отправляем запрос к Groq...')

    // Запрос к API Groq
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Ты — Ichgram AI Business Assistant, эксперт по SMM, копирайтингу и клиентскому сервису в Instagram. Твоя цель — помогать бизнесу расти. Отвечай структурированно, лаконично, используй списки и подходящие эмодзи. Форматируй текст в Markdown.'
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