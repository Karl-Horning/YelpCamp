const mongoose = require('mongoose');
// const Campground = require('./models/campground');
// const Comment = require('./models/comment');

const CommentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
});


module.exports = mongoose.model('Comment', CommentSchema);