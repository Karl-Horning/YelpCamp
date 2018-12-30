const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');

const data = [{
        name: 'Granite Hill',
        image: 'adrian-393713-unsplash.jpg',
        description: 'This is a huge granite hill: no bathrooms, no water, beautiful granite.'
    },
    {
        name: 'Desert Mesa',
        image: 'sahin-yesilyaprak-546700-unsplash.jpg',
        description: "Nice views, but it's in the desert!"
    },
    {
        name: "Glacier Camp",
        image: "dino-reichmuth-97252-unsplash.jpg",
        description: "A little bit remote, but otherwise an awesome place. Not sure if I'd bring the RV next time."
    },
    {
        name: "Lake Laky",
        image: "dino-reichmuth-123637-unsplash.jpg",
        description: "Beautiful mountains and lake. No internet or TV though."
    },
    {
        name: "Cloud's Rest",
        image: "andrew-gloor-576177-unsplash.jpg",
        description: "Nice and relaxing location."
    },
    {
        name: "Canyon Floor",
        image: "scott-goodwill-359336-unsplash.jpg",
        description: "Very high walls and not much sand. I'd go there again."
    },
    {
        name: "Sunset Creek",
        image: "arthur-poulin-96074-unsplash.jpg",
        description: "Beautiful valley with wonderful sunsets."
    }
]

function seedDB() {
    // Remove all campgrounds
    Campground.deleteMany({}, err => {
        if (err) {
            console.error(err);
        } else {
            console.warn('Removed campgrounds!');
        }
    });

    // Add campgrounds
    data.forEach(seed => {
        Campground.create(seed, (err, campground) => {
            if (err) {
                console.error(err);
            } else {
                console.warn('Added a campground!');
                // Add comments
                Comment.create({
                    text: 'This place is great, but I wish there was internet!',
                    author: 'Homer'
                }, (err, comment) => {
                    if (err) {
                        console.error(err);
                    } else {
                        campground.comments.push(comment);
                        campground.save();
                        console.warn('Created new comment!');
                    }
                });
            }
        });
    });

    // Add comments
    // Campground.remove({}, err => {
    //     if (err) {
    //         console.error(err);
    //     } else {
    //         console.warn('Removed campgrounds!');
    //     }
    // });
}

module.exports = seedDB;