var mongoose = require("mongoose");

// Campground Schema
var campgroundSchema = new mongoose.Schema({
    name: String,
    imagePath: String,
    description: String,
    price: Number,
    owner: {
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
        
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});
var Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;