# Database Schema (JSON Files)

This project relies on the filesystem for database storage, located in `backend/data/`.

## 1. Homes Model (`homes.json`)
Stores the properties listed on the platform. Array of objects.
```json
{
  "id": "uuid-v4-string",
  "homeName": "String",
  "price": "Number",
  "location": "String",
  "rating": "Number",
  "photoUrl": "String (URL)",
  "type": "String",
  "description": "String",
  "status": "String (e.g., 'Available')",
  "highlights": ["String Array"]
}
```

## 2. Users Model (`users.json`)
Stores registered users, categorized by roles. Object with arrays for each role.
```json
{
  "admin": [
    {
      "id": "uuid-v4-string",
      "email": "admin@example.com",
      "password": "hashed_password",
      "role": "admin",
      "refreshToken": "jwt_token_or_null",
      "accessToken": "jwt_token_or_null"
    }
  ],
  "host": [...],
  "user": [...]
}
```
*Note: Passwords are encrypted via bcryptjs. Access/Refresh tokens are sometimes cached here for invalidation.*
