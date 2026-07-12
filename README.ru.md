# ICHGRAM - Backend API
Бэкенд для социальной сети (Stack: Node.js, Express, MongoDB).

🌍 Читать на других языках: [English](README.md) | [Deutsch](README.de.md)

## 🚀 Быстрый старт

1. Установка зависимостей
Убедитесь, что у вас установлен Node.js, затем выполните:

npm install

2. Настройка окружения
Создайте файл .env в корне проекта и добавьте следующие переменные (настройте под свою локальную БД):

PORT=3333
MONGO_URI=mongodb://127.0.0.1:27017/ichgram
JWT_SECRET=super_secret_ichgram_key_2026

3. Наполнение базы данных (Seeding)
Чтобы не тестировать на пустом интерфейсе, запустите скрипт первичного наполнения.

Внимание: Скрипт полностью очищает текущие коллекции и создает эталонные данные.
node seed.js

Результат:
Создано 3 тестовых пользователя (пароль у всех: 123456):
Вариант 1: coder@test.com
Вариант 2: guru@test.com
Вариант 3: test@test.com
Сгенерировано 10+ постов со случайными изображениями и текстами.

4. Запуск сервера
npm run dev

Локальный адрес сервера: http://localhost:3333

🛠 Технологический стек
Runtime: Node.js (v18+)
Framework: Express.js
Database: MongoDB + Mongoose
Auth: JWT (JSON Web Tokens) + bcryptjs
Images: Multer (обработка FormData и хранение в Base64)

📖 API Документация
Подробное описание всех эндпоинтов, форматов запросов и ответов находится в файле API_CONTRACT.md.

📌 Ключевые эндпоинты для проверки:

POST /api/auth/register — Регистрация нового аккаунта.
POST /api/auth/login — Вход (поддерживает email или username).
GET /api/users/profile — Получение данных текущего пользователя.
PUT /api/users/profile — Обновление аватара и био (принимает FormData).
GET /api/posts — Получение общей ленты постов.
POST /api/posts — Создание нового поста с изображением.