# ICHGRAM - Backend API

Backend for the social network (Stack: Node.js, Express, MongoDB).

🌐 **Live Demo:** [ichgram-alexp.vercel.app](https://ichgram-alexp.vercel.app/)  
🔗 **Frontend Repository:** [instagram-clone-client](https://github.com/AlexPlotnikovICH/instagram-clone-client)

🌍 Read this in: [Deutsch](README.de.md) | [Русский](README.ru.md)

## 🚀 Quick Start

**1. Installing Dependencies**  
Make sure you have Node.js installed, then run:
```bash
npm install

2. Environment Configuration

Create a .env file in the project root and add the following variables:

PORT=3333
MONGO_URI=mongodb://127.0.0.1:27017/ichgram
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GROQ_API_KEY=your_groq_key

3. Database Seeding

To avoid testing with an empty interface, run the initial seeding script.

Warning: The script completely clears current collections and creates reference data.

node seed.js

Result:

3 test users created (password for all: 123456): coder@test.com, guru@test.com, test@test.com

10+ posts generated with images and texts.

4. Running the Server

npm run dev

Local server URL: http://localhost:3333

🛠 Tech Stack & Architecture
Runtime: Node.js (v18+)

Framework: Express.js

Database: MongoDB Atlas + Mongoose

Auth: JWT (JSON Web Tokens) + bcryptjs

Media Storage: Cloudinary (optimized image pipeline, replacing heavy Base64 storage)

AI Integration: Groq API (llama-3.1-8b-instant) for the business assistant chatbot

Security: Express Rate Limit (anti-spam), CORS (strict origin whitelist)

📖 API Documentation
A detailed description of all endpoints, request and response formats can be found in the API_CONTRACT.md file.

📌 Key endpoints:

POST /api/auth/register — New account registration

POST /api/auth/login — Login (supports email or username)

POST /api/ai/chat — AI Business Assistant communication

POST /api/posts — Create a new post (handles image upload to Cloudinary)