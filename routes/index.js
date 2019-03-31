var express  = require("express"),
    router   = express.Router({mergeParams: true}),
    passport = require("passport"),
    User     = require("./../models/users");

// Landing page route
router.get("/", function(req, res){
    res.render("landing");
});


// User Login &&& Register Routes
// Register page route
router.get("/register", function(req, res){
    res.render("register");
});

// Posting Register credentials route
router.post("/register", function(req, res){
    User.register(new User({email: req.body.email}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash('error', 'This email already used !');
            res.redirect("/register");
        } else {
            User.findOneAndUpdate({_id: user._id}, {$set:{name: req.body.name}}, {new: true}, function(err, userUpdated){
                if(err) {
                    console.log(err);
                } else {
                    passport.authenticate('local')(req, res, function(){
                    req.flash('success', 'You successfully created new account, welcome!');
                    res.redirect("/campgrounds");
                    });
                }
            });
        }
    });
});

// Getting login template route
router.get("/login", function(req, res){
    res.render("login");
});

// Posting login info route
router.post('/login', 
  passport.authenticate('local', { 
      failureRedirect: '/login', 
      badRequestMessage: 'Wrong username or password',
      failureFlash: true
  }),
  function(req, res) {
    req.flash('success', 'You successfully logged in');
    res.redirect('/campgrounds');
  }
);

// Logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash('success', 'You successfully logged out');
    res.redirect("/campgrounds");
});

module.exports = router;