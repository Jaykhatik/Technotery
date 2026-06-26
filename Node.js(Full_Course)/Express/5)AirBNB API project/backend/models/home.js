const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const homeSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  homeName: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  rating: { type: Number, default: 0 },
  photoUrl: { type: String },
  type: { type: String },
  description: { type: String },
  status: { type: String, default: 'Available' },
  highlights: [{ type: String }],
});

// Configure toJSON to convert _id to homeId and place it first
homeSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    const { _id, id, ...rest } = ret;
    return { homeId: _id, ...rest };
  }
});

module.exports = mongoose.model('Home', homeSchema);
