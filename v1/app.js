const express = require('express');
const app = express();
const bodyParser = require('body-parser');

var campgrounds = [{
        name: 'Salmon Creek',
        image: '1163419.png'
    },
    {
        name: 'Granite Hill',
        image: 'pixabay-837221.png'
    },
    {
        name: 'Mountain Goat\'s Rest',
        image: 'pixabay-1892494.png'
    },
    {
        name: 'Daisy Mountain',
        image: 'pixabay-3797080.png'
    }
]

app.use(express.static('views'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'ejs');

// index
app.get('/', (req, res) => {
    res.render('index');
});

// campgrounds
app.get('/campgrounds', (req, res) => {
    res.render('campgrounds', {
        campgrounds: campgrounds
    });
});

// Add campground
app.post('/campgrounds', (req, res) => {
    // get data from form and add to campgrounds
    const name = req.body.name;
    const image = req.body.image;
    const newCampground = {
        name: name,
        image: image
    };
    campgrounds.push(newCampground);

    // redirect back to campgrounds page
    res.redirect('/campgrounds');
});

app.get('/campgrounds/new', (req, res) => {
    res.render('new');
});

// Run the server
app.listen(3000, () => console.log("The server is running on port 3000"));