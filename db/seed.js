var mongoose = require("./connection");
var seedData = require("./seeds");

var Episode = mongoose.model("Episode");
var Show = mongoose.model("Show");

Show.remove({}).then(function(){
  Show.collection.insert(seedData).then(function(){
    process.exit();
  });
});
