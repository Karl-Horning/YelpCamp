const express = require('express');
const router = express.Router({
    mergeParams: true
});
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');

// Comments new
router.get('/new', middleware.isLoggedIn, (req, res) => {
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
router.post('/', middleware.isLoggedIn, (req, res) => {
    // lookup campground by ID
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.error(err);
            res.redirect('/campgrounds');
        } else {
            // create new comment
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    req.flash('error', 'Oops, something went wrong');
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
                    req.flash('success', 'Comment added successfully');
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            });
        }
    });
});

// Comments edit route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            res.redirect('back');
        } else {
            res.render('comments/edit', {
                campground_id: req.params.id,
                comment: foundComment
            });
        }
    });
});

// Comments update route
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            console.error(err);
            res.redirect('back');
        } else {
            // render the template with that campground
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

// Comments destroy route
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, err => {
        if (err) {
            req.flash('error', 'Oops, something went wrong');
            res.redirect('back');
        } else {
            req.flash('success', 'Comment deleted');
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

module.exports = router;