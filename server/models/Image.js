// server/models/image.js
/*
 |--------------------------------------
 | Image Model
 |--------------------------------------
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  location: { type: String, required: true },
  userId: { type: String, required: true },
  createDate: { type: Date, required: true },
  editDate: { type: Date, required: true },
  description: String,
  likes: { type: Number, required: true },
  online: { type: Boolean, required: true },
  clickCounter: { type: Number, required: true }
});

module.exports = mongoose.model('Image', imageSchema);
