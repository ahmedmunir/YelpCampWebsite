var Campground = require("./../models/campgrounds"),
    Comment    = require("./../models/comments");

var middlewareObj = {};

// Middleware Functions
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('error', 'You must sign in first');
        res.redirect("/login");
    }
};

middlewareObj.isOwner = function(req, res, next){
    Campground.findOne({_id: req.params.id}).populate('User').exec(function(err, foundCampground){
       if(err){
           console.log("Error1");
       } else {
           if(foundCampground.owner.authorId.equals(req.user._id)) {
                next();
           } else {
               req.flash('error', 'you must be the owner to delete or update this post');
               res.redirect("/campgrounds/" + foundCampground._id);
           }
       }
    });
};

middlewareObj.isCommentOwner = function(req, res, next){
    Comment.findOne({_id: req.params.comment_id}).populate('Comment').exec(function(err, foundComment){
        if(err){
            console.log("Error2");
        } else {
            if(foundComment.author.authorId.equals(req.user._id)) {
                next();
            } else {
                res.redirect("/campgrounds");
            }
        }
    });
};

module.exports = middlewareObj;