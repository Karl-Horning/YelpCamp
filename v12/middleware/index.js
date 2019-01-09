const Campground = require('../models/campground');
const Comment = require('../models/comment');
var middlewareObj = {};

// Middleware
middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/login');
}

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    // is user logged in?
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                req.flash('error', 'Campground not found');
                res.redirect('back');
            } else {
                // does user own campground?
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'You don\'t have permission to edit or delete someone else\'s campground');
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', 'You need to login first to do that');
        res.redirect('back');
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    // is user logged in?
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                req.flash('error', 'Oops, something went wrong');
                res.redirect('back');
            } else {
                // does user own comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'You don\'t have permission to edit someone else\'s comment');
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', 'You need to login first to do that');
        res.redirect('back');
    }
}

module.exports = middlewareObj;