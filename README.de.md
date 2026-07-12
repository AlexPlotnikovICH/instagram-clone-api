# ICHGRAM - Backend API
Backend für das soziale Netzwerk (Stack: Node.js, Express, MongoDB).

🌍 Auf anderen Sprachen lesen: [English](README.md) | [Русский](README.ru.md)

## 🚀 Schnellstart

1. Abhängigkeiten installieren
Stellen Sie sicher, dass Node.js installiert ist, und führen Sie dann aus:

npm install

2. Umgebungskonfiguration
Erstellen Sie eine .env-Datei im Projektwurzelverzeichnis und fügen Sie die folgenden Variablen hinzu (passen Sie diese an Ihre lokale Datenbank an):

PORT=3333
MONGO_URI=mongodb://127.0.0.1:27017/ichgram
JWT_SECRET=super_secret_ichgram_key_2026

3. Datenbank-Seeding
Um das Testen mit einer leeren Benutzeroberfläche zu vermeiden, führen Sie das Skript für die Erstbefüllung aus.
Achtung: Das Skript löscht die aktuellen Sammlungen vollständig und erstellt Referenzdaten.

node seed.js

Ergebnis:
3 Testbenutzer erstellt (Passwort für alle: 123456):
Benutzer 1: coder@test.com
Benutzer 2: guru@test.com
Benutzer 3: test@test.com
Über 10 Beiträge mit zufälligen Bildern und Texten generiert.

4. Server starten
npm run dev

Lokale Server-Adresse: http://localhost:3333

🛠 Technologiestack
Runtime: Node.js (v18+)
Framework: Express.js
Datenbank: MongoDB + Mongoose
Authentifizierung: JWT (JSON Web Tokens) + bcryptjs
Bilder: Multer (FormData-Verarbeitung und Base64-Speicherung)

📖 API-Dokumentation
Eine detaillierte Beschreibung aller Endpunkte, Anfrage- und Antwortformate finden Sie in der Datei API_CONTRACT.md.

📌 Wichtige Endpunkte zum Überprüfen:

POST /api/auth/register — Registrierung eines neuen Kontos.
POST /api/auth/login — Anmeldung (unterstützt E-Mail oder Benutzernamen).
GET /api/users/profile — Daten des aktuellen Benutzers abrufen.
PUT /api/users/profile — Avatar und Biografie aktualisieren (akzeptiert FormData).
GET /api/posts — Haupt-Feed der Beiträge abrufen.
POST /api/posts — Einen neuen Beitrag mit Bild erstellen.