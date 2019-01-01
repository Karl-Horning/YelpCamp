const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');
seedDB = require('./seeds');

mongoose.connect('mongodb://localhost/yelp_camp', {
    useNewUrlParser: true
});
app.use(express.static('views'));
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'ejs');
seedDB();

// Passport configuration
app.use(require('express-session')({
    secret: 'This should not usually be uploaded to GitHub!',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// index
app.get('/', (req, res) => {
    res.render('landing');
});

// INDEX: show all campgrounds
app.get('/campgrounds', (req, res) => {
    // get all campgrounds from DB
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.error(err);
        } else {
            res.render('campgrounds/index', {
                campgrounds: campgrounds
            });
        }
    });
});

// Add campground
app.post('/campgrounds', (req, res) => {
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

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

// SHOW: shows info about one campground
app.get('/campgrounds/:id', (req, res) => {
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

// //////////////////////////////////////////
// Comments Routes
// //////////////////////////////////////////

app.get('/campgrounds/:id/comments/new', (req, res) => {
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

app.post('/campgrounds/:id/comments', (req, res) => {
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

// Run the server
app.listen(3000, () => console.log("The server is running on port 3000"));