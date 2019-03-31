//application Packages Require
var express               = require("express"),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    methodOverride        = require("method-override"),
    passport              = require("passport"),
    localStrategy         = require("passport-local").Strategy,
    passportLocalMongoose = require("passport-local-mongoose"),
    flash                 = require("connect-flash"),
    favicon               = require('serve-favicon'),
    path                  = require('path');

// Database Require
var Campground = require("./models/campgrounds"),
    User       = require("./models/users"),
    Comment    = require("./models/comments");

// Routes Require
var CampgroundRoute = require("./routes/campgrounds"),
    indexRoute      = require("./routes/index"),
    CommentRoute    = require("./routes/comments");


// application important configuration
var app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(favicon(path.join('public','favicon.ico')));
app.use(require("express-session")({
    secret: "Welcome to my yelpcamp version 2",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// Middleware function used to pass variables to each route we use:
app.use(flash());
app.use(function(req, res, next){
    res.locals.user= req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

//DataBase Configuration
// mongoose.connect('mongodb://localhost/yelpcampv2', {useNewUrlParser: true, autoIndex: false});
mongoose.connect("mongodb://drjempo:Brockliden20@ds229186.mlab.com:29186/yelpcamp", {useNewUrlParser: true, autoIndex: false});

// Rest of configuration for user authentication
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.use(CampgroundRoute);
app.use(indexRoute);
app.use(CommentRoute);

 
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Has Just Started");
})