const mongoose = require('mongoose');
// const Campground = require('./models/campground');
// const Comment = require('./models/comment');

const commentSchema = mongoose.Schema({
    text: String,
    author: String,
});


module.exports = mongoose.model('Comment', commentSchema);