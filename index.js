var express = require('express');
var parser = require('body-parser');
var hbs = require('express-handlebars');
var mongoose = require('./db/connection');

var app = express();

var Show = mongoose.model("Show");
var Episode = mongoose.model("Episode");

app.set("port", process.env.PORT || 3001);
app.use("/assets", express.static("public"));
app.use(parser.urlencoded({extended: true}));
app.set("view engine", "hbs");
app.engine(".hbs", hbs({
  extname: ".hbs",
  partialsDir: "views/",
  layoutsDir: "views/",
  defaultLayout: "layout-main"
}));

app.get("/", function(req, res){
  res.render("layout-main");
});

app.get("/shows", function(req, res){
  Show.find({}).then(function(shows){
    res.render("shows-index", {
      shows: shows
    });
  });
});

app.get("/shows/:name", function(req, res){
  Show.findOne({name: req.params.name}).then(function(show){
    res.render("shows-show", {
      show: show
    });
  });
});

app.listen(app.get("port"), function(req, res){
  console.log("hi");
});
