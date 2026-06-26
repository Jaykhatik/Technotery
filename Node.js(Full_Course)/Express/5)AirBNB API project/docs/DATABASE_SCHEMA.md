# Database Schema (MongoDB / Mongoose)

This project relies on MongoDB Atlas for database storage, with Mongoose schemas defined in `backend/models/`.

## 1. Home Schema (`Home` Model)
Stores the properties listed on the platform in the `homes` collection.
```javascript
{
  _id: { type: String, default: uuidv4 }, // Primary key generated as UUID string
  homeName: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  rating: { type: Number, default: 0 },
  photoUrl: { type: String },
  type: { type: String },
  description: { type: String },
  status: { type: String, default: 'Available' },
  highlights: [{ type: String }],
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reference to the user who created it
}
```

## 2. User Schema (`User` Model)
Stores registered users in the `users` collection.
```javascript
{
  _id: { type: String, default: uuidv4 }, // Primary key generated as UUID string
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
  role: { 
    type: String, 
    enum: ['admin', 'host', 'user'], 
    default: 'user' 
  }
}
```
*Note: Passwords must be encrypted via bcryptjs before saving. Mongoose is configured to return the `_id` as `homeId` (for homes) and `userId` (for users) to match frontend expectations, and strictly hides the password from JSON outputs. JWT tokens are purely stateless and are NEVER stored in the database.*
