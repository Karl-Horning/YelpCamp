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

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

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
                campgrounds: campgrounds,
                currentUser: req.user
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

app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
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

app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
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

// //////////////////////////////////////////
// Authorisation routes
// //////////////////////////////////////////

// Show register form
app.get('/register', (req, res) => {
    res.render('register');
});

// Handle sign up logic
app.post('/register', (req, res) => {
    const newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.error(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/campgrounds');
        });
    });
});

// Show login form
app.get('/login', (req, res) => {
    res.render('login');
});

// Handle login logic
app.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), (req, res) => {
    // middleware is used to login
});

// Logout route
app.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Run the server
app.listen(3000, () => console.log("The server is running on port 3000"));