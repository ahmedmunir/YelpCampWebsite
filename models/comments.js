var mongoose = require("mongoose");

// Comments Schema
var commentsSchema = new mongoose.Schema({
    comment: String,
    date: {
        type: Date,
        default: Date.now
    },
    author:{
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    }
});
var Comment = mongoose.model("Comment", commentsSchema);

module.exports = Comment;