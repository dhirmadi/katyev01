// server/models/likeImage.js
/*
 |--------------------------------------
 | Image Model
 |--------------------------------------
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeImageSchema = new Schema({
  imageId: { type: String, required: true },
  users: [{ userId : String}]
});

module.exports = mongoose.model('likeImage', likeImageSchema);
