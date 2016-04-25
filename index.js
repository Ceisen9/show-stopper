var express = require('express');
var parser = require('body-parser');
var hbs = require('express-handlebars');
var mongoose = require('./db/connection');

var app = express();

var Show = mongoose.model("Show");
var Episode = mongoose.model("Episode");

app.set("port", process.env.PORT || 3001);
app.use("/assets", express.static("public"));
app.use(parser.json({extended: true}));
app.set("view engine", "hbs");
app.engine(".hbs", hbs({
  extname: ".hbs",
  partialsDir: "views/",
  layoutsDir: "views/",
  defaultLayout: "layout-main"
}));

app.get("/api/shows", function(req, res){
  Show.find({}).lean().exec().then(function(shows){
    res.json(shows);
  });
});

app.post("/api/shows", function(req, res){
  res.json(req.body);
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

app.get("/*", function(req, res){
  res.render("shows");
});

app.listen(app.get("port"), function(req, res){
  console.log("hi");
});
