var express = require('express');
var parser = require('body-parser');
var path = require('path');
var hbs = require('express-handlebars');
var mongoose = require('./db/connection');
var passport = require('passport');
require('./config/passport')(passport);
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');


var app = express();

var Show = mongoose.model("Show");
var Episode = mongoose.model("Episode");
var User = mongoose.model("User");

app.use("/assets", express.static("public"));
app.use(parser.json({extended: true}));
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.set("port", process.env.PORT || 3001);
app.set("view engine", "hbs");
app.engine(".hbs", hbs({
  extname: ".hbs",
  partialsDir: "views/",
  layoutsDir: "views/",
  defaultLayout: "layout-main"
}));

// require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// route for home page
app.get('/', function(req, res) {
  console.log(req.session);
  res.render("shows");
});

app.get("/api/shows", function(req, res){
  Show.find({}).lean().exec().then(function(shows){
    res.json(shows);
  });
});

app.post("/api/shows", function(req, res){
  Show.create(req.body).then(function(show){
    res.json(show);
  });
});

app.get("/api/shows/:name", function(req, res){
  Show.findOne({name: req.params.name}).then(function(show){
    res.json(show);
  });
});

app.delete("/api/shows/:name", function(req, res){
  Show.findOneAndRemove({name: req.params.name}).then(function(){
    res.json({success: true});
  });
});

app.put("/api/shows/:name", function(req, res){
  Show.findOneAndUpdate({name: req.params.name}, req.body.show, {new: true}).then(function(show){
    res.json(show);
  });
});

app.get('/api/profile', isLoggedIn, function(req, res) {
  User.findById(req.session.passport.user).then(function(user){
    // console.log("backend");
    // console.log(user);
    res.json(user)
  })
});

// =====================================
// FACEBOOK ROUTES =====================
// =====================================
// route for facebook authentication and login
app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

// handle the callback after facebook has authenticated the user
app.get('/auth/facebook/callback',
passport.authenticate('facebook', {
  successRedirect : '/#/shows',
  failureRedirect : '/#/'
}));

// route for logging out
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/#/');
});


// app.get("/*", function(req, res){
//   console.log(req.session);
//   res.render("shows");
// });

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

app.listen(app.get("port"), function(req, res){
  console.log("hi");
});
