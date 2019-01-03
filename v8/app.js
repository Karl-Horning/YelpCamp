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

// Requiring routes
const indexRoutes = require('./routes/index');
const campgroundRoutes = require('./routes/campgrounds');
const commentRoutes = require('./routes/comments');

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

app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

// Run the server
app.listen(3000, () => console.log("The server is running on port 3000"));