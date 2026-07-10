# ICHGRAM API - Backend Context (Stack: Node.js, Express, MongoDB)

## 1. Базовый URL

Все запросы идут на: `http://localhost:3333`

## 2. Модели Данных (MongoDB)

- **User:** `_id`, `fullname`, `username`, `email`, `password` (hashed), `profile_image` (Base64/String), `bio`.
- **Post:** `_id`, `user` (Ref User), `image` (Base64/String), `caption`, `likes` (Array of User IDs), `comments` (Array of objects: `{ user: Ref, text: String }`).
- **Notification:** `_id`, `recipient` (Ref User), `sender` (Ref User), `type` (enum: 'like', 'comment', 'follow'), `post` (Ref Post, optional), `isRead` (Boolean).
- **Follow:** `_id`, `follower` (Ref User), `following` (Ref User).

## 3. Эндпоинты (Роуты)

### Auth (`/api/auth`)

- `POST /register`: body -> `{ fullname, username, email, password }`.
  **Ответ:** `{ token, _id, username, fullname, email, bio, profile_image }`.
- `POST /login`: body -> `{ email, password }` (в поле email можно слать username).
  **Ответ:** `{ token, _id, username, fullname, email, bio, profile_image }`.

### Users (`/api/users`) - Нужен Bearer Token!

- `GET /search?query=...`: Поиск по username/fullname.
- `POST /follow/:id`: Подписаться.
- `POST /unfollow/:id`: Отписаться.
- `GET /profile`: Получить данные своего профиля.
- `PUT /profile`: Обновить профиль. **ВАЖНО: FormData!** Поля: `fullname`, `bio`, `profile_image` (file).

### Posts (`/api/posts`)

- `GET /explore`: Лента случайных 20 постов (с `populate` автора).
- `GET /`: Все посты (от новых к старым, с `populate` автора).
- `POST /`: Создание поста. **ВАЖНО: FormData!** Поля: `image` (file), `caption` (text).
- `DELETE /:id`: Удалить свой пост.
- `PUT /:id/like`: Лайк/анлайк. Возвращает массив ID лайкнувших.
- `POST /:id/comment`: Добавить коммент. body -> `{ text }`.

### Notifications (`/api/notifications`) - Нужен Bearer Token!

- `GET /`: Уведомления юзера (с `populate` отправителя и поста).
