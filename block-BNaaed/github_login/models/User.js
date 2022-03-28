const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema(
  {
    name: String,
    username: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
