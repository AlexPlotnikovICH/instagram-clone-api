# ICHGRAM - Backend API

Бэкенд для социальной сети (Стек: Node.js, Express, MongoDB).

🌐 **Live Demo:** [ichgram-alexp.vercel.app](https://ichgram-alexp.vercel.app/)  
🔗 **Репозиторий Фронтенда:** [instagram-clone-client](https://github.com/AlexPlotnikovICH/instagram-clone-client)

🌍 Читать на: [English](README.md) | [Deutsch](README.de.md)

## 🚀 Быстрый старт

**1. Установка зависимостей**  
Убедись, что установлен Node.js, затем выполни:
```bash
npm install

2. Настройка окружения
Создай файл .env в корне проекта и добавь следующие переменные:

PORT=3333
MONGO_URI=mongodb://127.0.0.1:27017/ichgram
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GROQ_API_KEY=your_groq_key

3. Наполнение базы данных

Чтобы не тестировать приложение с пустым интерфейсом, запусти скрипт начального наполнения.

Внимание: Скрипт полностью очищает текущие коллекции и создает тестовые данные.
node seed.js

Результат:

Создано 3 тестовых пользователя (пароль для всех: 123456): coder@test.com, guru@test.com, test@test.com

Сгенерировано более 10 постов с изображениями и текстами.

4. Запуск сервера
npm run dev

Локальный адрес сервера: http://localhost:3333

🛠 Стек технологий и Архитектура
Среда выполнения: Node.js (v18+)

Фреймворк: Express.js

База данных: MongoDB Atlas + Mongoose

Авторизация: JWT (JSON Web Tokens) + bcryptjs

Хранение медиа: Cloudinary (оптимизированный пайплайн обработки изображений вместо тяжелого Base64)

Интеграция ИИ: Groq API (модель llama-3.1-8b-instant) для чат-бота бизнес-ассистента

Безопасность: Express Rate Limit (защита от спама), CORS (строгий белый список доменов)

📖 Документация API
Подробное описание всех эндпоинтов, форматов запросов и ответов можно найти в файле API_CONTRACT.md.

📌 Ключевые эндпоинты:

POST /api/auth/register — Регистрация нового аккаунта

POST /api/auth/login — Авторизация (поддерживает email или username)

POST /api/ai/chat — Общение с AI Бизнес-ассистентом

POST /api/posts — Создание нового поста (с загрузкой изображения в Cloudinary)