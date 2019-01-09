const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');

const data = [{
        name: 'Granite Hill',
        image: 'adrian-393713-unsplash.jpg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam porttitor tincidunt eros, quis pharetra erat tempor a. Sed ac lorem malesuada, eleifend libero eget, egestas est. Aliquam eu nulla eget mi elementum sollicitudin sit amet eu mauris. Integer vitae ante eget est facilisis accumsan ut vitae sem. Pellentesque in vestibulum purus. Morbi sollicitudin, sapien ac suscipit consequat, ligula urna tempor libero, ut vehicula eros felis nec ipsum. Aenean egestas, lacus in aliquam suscipit, mi velit bibendum eros, eu eleifend enim sem at libero.'
    },
    {
        name: 'Desert Mesa',
        image: 'sahin-yesilyaprak-546700-unsplash.jpg',
        description: "No, no, no. A vigilante is just a man lost in scramble for his own gratification. He can be destroyed or locked up. But if you make yourself more than just a man, if you devote yourself to an idel and if they can't stop you then you become something else entirely. Legend, Mr Wayne."
    },
    {
        name: "Glacier Camp",
        image: "dino-reichmuth-97252-unsplash.jpg",
        description: "Lorem ipsum dolor amet vape selfies aesthetic seitan affogato tousled, flannel drinking vinegar synth. You probably haven't heard of them pork belly helvetica lo-fi. Gluten-free viral post-ironic, meditation schlitz artisan chillwave forage vape butcher lumbersexual pork belly XOXO fashion axe umami. Kombucha chia tousled tacos air plant. Banh mi brooklyn normcore lomo health goth vegan glossier chambray. Biodiesel migas palo santo fashion axe food truck."
    },
    {
        name: "Lake Laky",
        image: "dino-reichmuth-123637-unsplash.jpg",
        description: "Mice sniff other cat's butt and hang jaw half open thereafter burrow under covers cats are cute. Ask for petting. White cat sleeps on a black shirt i could pee on this if i had the energy or run up and down stairs, brown cats with pink ears Gate keepers of hell yet poop in litter box, scratch the walls yet ooooh feather moving feather!. Stare at the wall, play with food and get confused by dust chase dog then run away but fight an alligator and win for cough furball vommit food and eat it again murf pratt ungow ungow eat all the power cords. Fall over dead (not really but gets sypathy) proudly present butt to human so push your water glass on the floor. Chase the pig around the house meow all night yet ask for petting furrier and even more furrier hairball, yet ooooh feather moving feather!, yet chew foot going to catch the red dot today going to catch the red dot today. Shove bum in owner's face like camera lens hack up furballs so fight an alligator and win yet purr like an angel so where is my slave? I'm getting hungry but really likes hummus meow and walk away. I could pee on this if i had the energy fat baby cat best buddy little guy hide from vacuum cleaner freak human out make funny noise mow mow mow mow mow mow success now attack human love, or grab pompom in mouth and put in water dish. Fooled again thinking the dog likes me step on your keyboard while you're gaming and then turn in a circle but paw at your fat belly but plop down in the middle where everybody walks need to chase tail. You are a captive audience while sitting on the toilet, pet me cats woo so if it smells like fish eat as much as you wish. Pet my belly, you know you want to; seize the hand and shred it! attack dog, run away and pretend to be victim chew the plant, and while happily ignoring when being called and hopped up on catnip pose purrfectly to show my beauty for meow go back to sleep owner brings food and water tries to pet on head, so scratch get sprayed by water because bad cat. Make meme, make cute face kitty ipsum dolor sit amet, shed everywhere shed everywhere stretching attack your ankles chase the red dot, hairball run catnip eat the grass sniff kitty ipsum dolor sit amet, shed everywhere shed everywhere stretching attack your ankles chase the red dot, hairball run catnip eat the grass sniff i shredded your linens for you for purr as loud as possible, be the most annoying cat that you can, and, knock everything off the table and licks paws. Scratch at fleas, meow until belly rubs, hide behind curtain when vacuum cleaner is on scratch strangers and poo on owners food make meme, make cute face or cat is love, cat is life but cough furball into food bowl then scratch owner for a new one."
    },
    {
        name: "Cloud's Rest",
        image: "andrew-gloor-576177-unsplash.jpg",
        description: "Who are you talking to right now? Who is it you think you see? Do you know how much I make a year? I mean, even if I told you, you wouldn't believe it. Do you know what would happen if I suddenly decided to stop going into work? "
    },
    {
        name: "Canyon Floor",
        image: "scott-goodwill-359336-unsplash.jpg",
        description: "Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro. De carne lumbering animata corpora quaeritis. Summus brains sit​​, morbo vel maleficia? De apocalypsi gorger omero undead survivor dictum mauris. Hi mindless mortuis soulless creaturas, imo evil stalking monstra adventus resi dentevil vultus comedat cerebella viventium. Qui animated corpse, cricket bat max brucks terribilem incessu zomby. The voodoo sacerdos flesh eater, suscitat mortuos comedere carnem virus. Zonbi tattered for solum oculi eorum defunctis go lum cerebro. Nescio brains an Undead zombies. Sicut malus putrid voodoo horror. Nigh tofth eliv ingdead."
    },
    {
        name: "Sunset Creek",
        image: "arthur-poulin-96074-unsplash.jpg",
        description: "Now that the, uh, garbage ball is in space, Doctor, perhaps you can help me with my sexual inhibitions? You are the last hope of the universe. Fry, we have a crate to deliver. Wow, you got that off the Internet? In my day, the Internet was only used to download pornography."
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
    // data.forEach(seed => {
    //     Campground.create(seed, (err, campground) => {
    //         if (err) {
    //             console.error(err);
    //         } else {
    //             console.warn('Added a campground!');
    //             // Add comments
    //             Comment.create({
    //                 text: 'This place is great, but I wish there was internet!',
    //                 author: 'Homer'
    //             }, (err, comment) => {
    //                 if (err) {
    //                     console.error(err);
    //                 } else {
    //                     campground.comments.push(comment);
    //                     campground.save();
    //                     console.warn('Created new comment!');
    //                 }
    //             });
    //         }
    //     });
    // });

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