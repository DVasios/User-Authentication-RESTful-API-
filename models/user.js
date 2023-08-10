// Dependencies
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// User Schema
const UserSchema = new Schema({
    name: { type: String, required: true, minLength: 3, maxLength: 100 },
    password: { type: String, required: true, minLength: 5, maxLength: 100 },
    email: { type: String, required: true }
});

// Export model
module.exports = mongoose.model("User", UserSchema);