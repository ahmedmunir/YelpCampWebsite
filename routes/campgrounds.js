var express    = require("express"),
    router     = express.Router({mergeParams: true}),
    Campground = require("./../models/campgrounds"),
    User       = require("./../models/users"),
    middlewareObj = require("./../middleware/middlewareFunctions");

// Campgrounds Route
// This route to display all campgrounds
router.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, placesToVisit){
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {places: placesToVisit});
        }
    });
});

// This route to post new campground
router.post("/campgrounds", function(req, res){
    Campground.create({
        name: req.body.name,
        imagePath: req.body.imagePath,
        description: req.body.description,
        price: req.body.price,
        owner: {
            authorId: req.user,
            username: req.user.name
        }
    }, function(err, campgroundCreated){
        if(err){
            console.log(err);
        } else {
            campgroundCreated.save();
            User.findOne({_id: req.user._id}, function(err, foundUser){
                if(err) {
                    console.log(err);
                } else {
                    foundUser.campgrounds.push(campgroundCreated);
                    foundUser.save(function(err, dataCreated){
                        if(err) {
                            console.log(err);
                        } else {
                            req.flash('success', 'You successfully created new campground!');
                            res.redirect("/campgrounds");
                        }
                    });
                }
            });
        }
    });
});

// This route to get template of creating new campground
router.get("/campgrounds/new", middlewareObj.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// This route to get template of show campground
router.get("/campgrounds/:id", function(req, res){
    Campground.findOne({_id: req.params.id}).populate('comments').exec(function(err, foundCampground){
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// This route to get template of edit exist campground
router.get("/campgrounds/:id/edit", middlewareObj.isLoggedIn, middlewareObj.isOwner, function(req, res){
    Campground.findOne({_id: req.params.id}, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

// This route to update current campground
router.put("/campgrounds/:id", middlewareObj.isLoggedIn, middlewareObj.isOwner, function(req, res){
    Campground.findOneAndUpdate({_id: req.params.id},
        {$set: {name: req.body.name, imagePath: req.body.imagePath, description: req.body.description, price: req.body.price}},
        {new: true}, function(err, updatedCampground){
            if(err){
                console.log(err);
            } else {
                req.flash('success', 'You succesfully edited your post');
                res.redirect("/campgrounds/" + updatedCampground._id);
            }
        }
    );
});

// This route to delete campground
router.delete("/campgrounds/:id", middlewareObj.isLoggedIn, middlewareObj.isOwner, function(req, res){
    Campground.findOneAndDelete({_id: req.params.id}, function(err, deletedOne){
        if(err){
            console.log(err);
        } else {
            req.flash('success', 'You successfully deleted your post');
            res.redirect("/campgrounds");
        }
    });
});

module.exports= router;