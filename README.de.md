# ICHGRAM - Backend API

Backend für das soziale Netzwerk (Stack: Node.js, Express, MongoDB).

🌐 **Live Demo:** [ichgram-alexp.vercel.app](https://ichgram-alexp.vercel.app/)  
🔗 **Frontend Repository:** [instagram-clone-client](https://github.com/AlexPlotnikovICH/instagram-clone-client)

🌍 Lesen Sie dies auf: [English](README.md) | [Русский](README.ru.md)

## 🚀 Schnellstart

**1. Abhängigkeiten installieren**  
Stellen Sie sicher, dass Node.js installiert ist, und führen Sie dann Folgendes aus:
```bash
npm install

2. Umgebungskonfiguration

Erstellen Sie eine .env-Datei im Stammverzeichnis des Projekts und fügen Sie die folgenden Variablen hinzu:

PORT=3333
MONGO_URI=mongodb://127.0.0.1:27017/ichgram
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GROQ_API_KEY=your_groq_key

3. Datenbankbefüllung (Seeding)

Um die Anwendung nicht mit einer leeren Benutzeroberfläche zu testen, führen Sie bitte das initiale Seeding-Skript aus.

Achtung: Dieses Skript löscht die aktuellen Sammlungen vollständig und erstellt Testdaten.

node seed.js

Ergebnis:

Es werden 3 Testbenutzer erstellt (Passwort für alle: 123456): coder@test.com, guru@test.com, test@test.com

Es werden mehr als 10 Beiträge mit Bildern und Texten generiert.

4. Server starten
npm run dev

Lokale Server-Adresse: http://localhost:3333

🛠 Tech Stack & Architektur
Laufzeitumgebung: Node.js (v18+)

Framework: Express.js

Datenbank: MongoDB Atlas + Mongoose

Authentifizierung: JWT (JSON Web Tokens) + bcryptjs

Medienspeicher: Cloudinary (optimierte Bildverarbeitung anstelle von schwerem Base64-Speicher)

KI-Integration: Groq API (llama-3.1-8b-instant Modell) für den Business-Assistent-Chatbot

Sicherheit: Express Rate Limit (Anti-Spam), CORS (strenge Whitelist für Domains)

📖 API-Dokumentation
Eine detaillierte Beschreibung aller Endpunkte sowie der Anfrage- und Antwortformate finden Sie in der Datei API_CONTRACT.md.

📌 Wichtige Endpunkte:

POST /api/auth/register — Registrierung eines neuen Kontos

POST /api/auth/login — Anmeldung (unterstützt E-Mail oder Benutzername)

POST /api/ai/chat — Kommunikation mit dem KI Business-Assistenten

POST /api/posts — Erstellen eines neuen Beitrags (mit Bild-Upload zu Cloudinary)