const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'host', 'user'], default: 'user' }
});

// Configure toJSON to convert _id to userId, put it first, and hide sensitive data
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    const { _id, id, password, ...rest } = ret;
    // Return a clean object with userId first, and without any secret passwords
    return { userId: _id, ...rest };
  }
});

module.exports = mongoose.model('User', userSchema);
