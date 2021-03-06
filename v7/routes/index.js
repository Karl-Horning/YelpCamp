const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// Root route
router.get('/', (req, res) => {
    res.render('landing');
});

// Show register form
router.get('/register', (req, res) => {
    res.render('register');
});

// Handle sign up logic
router.post('/register', (req, res) => {
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
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle login logic
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), (req, res) => {
    // middleware is used to login
});

// Logout route
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/campgrounds');
});

// Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;