const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
// const Comment = require('./models/comment');
// const User = require('./models/user');
seedDB = require('./seeds');

seedDB();
mongoose.connect('mongodb://localhost/yelp_camp', {
    useNewUrlParser: true
});
app.use(express.static('views'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'ejs');

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
            res.render('index', {
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
    res.render('new');
});

// SHOW: shows info about one campground
app.get('/campgrounds/:id', (req, res) => {
    // find the campground with the provided ID
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
        if (err) {
            console.error(log);
        } else {
            // render the template with that campground
            res.render('show', {
                campground: foundCampground
            });
        }
    });
});

// Run the server
app.listen(3000, () => console.log("The server is running on port 3000"));