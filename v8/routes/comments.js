const express = require('express');
const router = express.Router({
    mergeParams: true
});
const Campground = require('../models/campground');
const Comment = require('../models/comment');

// Comments new
router.get('/new', isLoggedIn, (req, res) => {
    // find campground by ID
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.error(err);
        } else {
            res.render('comments/new', {
                campground: campground
            });
        }
    });
});

// Comments create
router.post('/', isLoggedIn, (req, res) => {
    // lookup campground by ID
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.error(err);
            res.redirect('/campgrounds');
        } else {
            // create new comment
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.error(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    // connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    // redirect to campground show page
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            });
        }
    });
});

// Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;