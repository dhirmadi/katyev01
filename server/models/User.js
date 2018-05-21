// server/models/user.js
/*
 |--------------------------------------
 | Image Model
 |--------------------------------------
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: { type: String, required: true },
  screenName: { type: String, required: true },
  avatar: { type: String, required: true },
  primaryRole: { type: String, required: true },
  location: { type: String, required: true },
  createDate: { type: Date, required: true },
  description: String
});

module.exports = mongoose.model('User', userSchema);
