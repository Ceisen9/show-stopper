var mongoose = require("mongoose");

var EpisodeSchema = new mongoose.Schema(
  {
    title: String,
  }
);

var ShowSchema = new mongoose.Schema(
  {
    name: String,
    episodes: [EpisodeSchema]
  }
);


mongoose.model("Episode", EpisodeSchema);
mongoose.model("Show", ShowSchema);
mongoose.connect("mongodb://localhost/show-stopper");

module.exports = mongoose;
