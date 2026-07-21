# ICHGRAM API - Backend Context (Stack: Node.js, Express, MongoDB)

## 1. Base URL

All requests go to: `http://localhost:3333`

## 2. Data Models (MongoDB)

- **User:** `_id`, `fullname`, `username`, `email`, `password` (hashed), `profile_image` (Base64/String), `bio`.
- **Post:** `_id`, `user` (Ref User), `image` (Base64/String), `caption`, `likes` (Array of User IDs), `comments` (Array of objects: `{ user: Ref, text: String }`).
- **Notification:** `_id`, `recipient` (Ref User), `sender` (Ref User), `type` (enum: 'like', 'comment', 'follow'), `post` (Ref Post, optional), `isRead` (Boolean).
- **Follow:** `_id`, `follower` (Ref User), `following` (Ref User).

## 3. Endpoints (Routes)

### Auth (`/api/auth`)

- `POST /register`: body -> `{ fullname, username, email, password }`.
  **Response:** `{ token, _id, username, fullname, email, bio, profile_image }`.
- `POST /login`: body -> `{ email, password }` (username can be sent in the email field).
  **Response:** `{ token, _id, username, fullname, email, bio, profile_image }`.

### Users (`/api/users`) - Bearer Token Required!

- `GET /search?query=...`: Search by username/fullname.
- `POST /follow/:id`: Follow user.
- `POST /unfollow/:id`: Unfollow user.
- `GET /profile`: Get own profile data.
- `PUT /profile`: Update profile. **IMPORTANT: FormData!** Fields: `fullname`, `bio`, `profile_image` (file).

### Posts (`/api/posts`)

- `GET /explore`: Feed of 20 random posts (with author populated).
- `GET /`: All posts (from newest to oldest, with author populated).
- `POST /`: Create a post. **IMPORTANT: FormData!** Fields: `image` (file), `caption` (text).
- `DELETE /:id`: Delete own post.
- `PUT /:id/like`: Like/unlike. Returns an array of liked User IDs.
- `POST /:id/comment`: Add a comment. body -> `{ text }`.

### Notifications (`/api/notifications`) - Bearer Token Required!

- `GET /`: User notifications (with sender and post populated).