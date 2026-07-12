# ICHGRAM - Backend API
Backend for the social network (Stack: Node.js, Express, MongoDB).

🌍 Read this in: [Deutsch](README.de.md) | [Русский](README.ru.md)

## 🚀 Quick Start

1. Installing Dependencies
Make sure you have Node.js installed, then run:

npm install

2. Environment Configuration
Create a .env file in the project root and add the following variables (configure them for your local DB):

PORT=3333
MONGO_URI=mongodb://127.0.0.1:27017/ichgram
JWT_SECRET=super_secret_ichgram_key_2026

3. Database Seeding
To avoid testing with an empty interface, run the initial seeding script.
Warning: The script completely clears current collections and creates reference data.

node seed.js

Result:
3 test users created (password for all: 123456):
User 1: coder@test.com
User 2: guru@test.com
User 3: test@test.com
10+ posts generated with random images and texts.

4. Running the Server

npm run dev

Local server URL: http://localhost:3333

🛠 Tech Stack
Runtime: Node.js (v18+)
Framework: Express.js
Database: MongoDB + Mongoose
Auth: JWT (JSON Web Tokens) + bcryptjs
Images: Multer (FormData processing and Base64 storage)

📖 API Documentation
A detailed description of all endpoints, request and response formats can be found in the API_CONTRACT.md file.

📌 Key endpoints for testing:
POST /api/auth/register — New account registration.
POST /api/auth/login — Login (supports email or username).
GET /api/users/profile — Get current user data.
PUT /api/users/profile — Update avatar and bio (accepts FormData).
GET /api/posts — Get the main post feed.
POST /api/posts — Create a new post with an image.