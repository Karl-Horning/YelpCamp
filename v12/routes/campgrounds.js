const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware');

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
router.post('/', middleware.isLoggedIn, (req, res) => {
    // get data from form and add to campgrounds
    const name = req.body.name;
    const price = req.body.price;
    const image = req.body.image;
    const description = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    const newCampground = {
        name: name,
        price: price,
        image: image,
        description: description,
        author: author
    };

    // create a new campground and save to DB
    Campground.create(newCampground, (err, newlyCreatedCampground) => {
        if (err) {
            console.error(err);
        } else {
            console.warn(newCampground);
            // redirect back to campgrounds page
            res.redirect('/campgrounds');
        }
    });
});

// NEW: show form to create campground
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

// SHOW: shows info about one campground
router.get('/:id', (req, res) => {
    // find the campground with the provided ID
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
        if (err) {
            console.error(err);
        } else {
            // render the template with that campground
            res.render('campgrounds/show', {
                campground: foundCampground
            });
        }
    });
});

// EDIT: edit a campground
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render('campgrounds/edit', {
            campground: foundCampground
        });
    });
});

// UPDATE: update a campground
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    // find and update the correct campground
    // redirect to the show page
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            console.error(err);
            res.redirect('/campgrounds');
        } else {
            // render the template with that campground
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

// DESTROY: delete a campground
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    // res.send('DELETING!');
    Campground.findByIdAndDelete(req.params.id, err => {
        if (err) {
            console.error(err);
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;