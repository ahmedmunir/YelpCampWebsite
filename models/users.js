var mongoose              = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

// User Schema
var userSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    campgrounds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campground"
        }
    ]
});
userSchema.plugin(passportLocalMongoose, {usernameField: "email"});
var User = mongoose.model("User", userSchema);

module.exports = User;