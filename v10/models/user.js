const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// Schema
const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);