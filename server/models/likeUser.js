// server/models/likeUser.js
/*
 |--------------------------------------
 | Image Model
 |--------------------------------------
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeUserSchema = new Schema({
  userId: { type: String, required: true },
  images: [{ imageId : String}]
});

module.exports = mongoose.model('likeUser', likeUserSchema);
