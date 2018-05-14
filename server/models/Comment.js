// server/models/image.js
/*
 |--------------------------------------
 | Image Model
 |--------------------------------------
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  userId: { type: String, required: true },
  imageId: { type: String, required: true },
  comment: String
});

module.exports = mongoose.model('Comment', commentSchema);
