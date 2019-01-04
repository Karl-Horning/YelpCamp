const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');

// INDEX: show all campgrounds
router.get('/', (req, res) => {
    // get all campgrounds from DB
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.error(err);
        } else {
            res.render('campgrounds/index', {
                campgrounds: campgrounds,
                currentUser: req.user
            });
        }
    });
});

// CREATE: add campground
router.post('/', isLoggedIn, (req, res) => {
    // get data from form and add to campgrounds
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const newCampground = {
        name: name,
        image: image,
        description: description
    };

    // create a new campground and save to DB
    Campground.create(newCampground, (err, newlyCreatedCampground) => {
        if (err) {
            console.error(err);
        } else {
            // redirect back to campgrounds page
            res.redirect('/campgrounds');
        }
    });
});

// NEW: show form to create campground
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

// SHOW: shows info about one campground
router.get('/:id', (req, res) => {
    // find the campground with the provided ID
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
        if (err) {
            console.error(log);
        } else {
            // render the template with that campground
            res.render('campgrounds/show', {
                campground: foundCampground
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