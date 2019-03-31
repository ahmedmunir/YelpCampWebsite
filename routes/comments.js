var express       = require("express"),
    router        = express.Router({mergeParams: true}),
    Comment       = require("./../models/comments"),
    Campground    = require("./../models/campgrounds"),
    middlewareObj = require("./../middleware/middlewareFunctions");

router.get("/campgrounds/:id/comment/new", middlewareObj.isLoggedIn, function(req, res){
    var campgroundId = req.params.id;
    res.render("comments/new", {id : campgroundId});
});

router.post("/campgrounds/:id/comment", middlewareObj.isLoggedIn, function(req, res){
    Comment.create({
        comment: req.body.comment,
        author : {
            authorId: req.user,
            username: req.user.name
        }
    }, function(err, commentCreated){
        if(err){
            console.log(err);
        } else {
            commentCreated.save();
            Campground.findOne({_id: req.params.id}, function(err, foundCampground){
                if(err){
                    console.log(err);
                } else {
                    foundCampground.comments.push(commentCreated);
                    foundCampground.save(function(err, campgroundSave) {
                        if(err){
                            console.log(err);
                        } else {
                            req.flash('success', 'You added new comment');
                            res.redirect("/campgrounds/" + foundCampground._id);
                        }
                    });
                }
            });
        }
    });
});

router.get("/campgrounds/:id/comment/:comment_id/edit", middlewareObj.isLoggedIn, middlewareObj.isCommentOwner, function(req, res){
    var campgroundId = req.params.id;
    Comment.findOne({_id: req.params.comment_id}, function(err, foundComment){
        if(err){
            console.log(err);
        } else {
            res.render("comments/edit", {campgroundId: campgroundId, comment: foundComment});
        }
    });
});

router.put("/campgrounds/:id/comment/:comment_id", middlewareObj.isLoggedIn, middlewareObj.isCommentOwner, function(req, res){
    Comment.findOneAndUpdate({_id: req.params.comment_id}, { $set: {comment: req.body.comment }}, {new: true}, function(err, commentUpdated){
        if(err) {
            console.log(err);
        } else {
            req.flash('success', 'you successfully edited your comment');
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/campgrounds/:id/comment/:comment_id", middlewareObj.isLoggedIn, middlewareObj.isCommentOwner, function(req, res){
    Comment.findOneAndDelete({_id: req.params.comment_id}, function(err) {
        if(err) {
            console.log(err);
        } else {
            req.flash('success', 'you successfully deleted your comment');
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;