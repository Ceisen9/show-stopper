var mongoose = require("mongoose");

var EpisodeSchema = new mongoose.Schema(
  {
    title: {type: String, lowercase: true }
  }
);

var ShowSchema = new mongoose.Schema(
  {
    name: {type: String, lowercase: true },
    episodes: [EpisodeSchema]
  }
);


mongoose.model("Episode", EpisodeSchema);
mongoose.model("Show", ShowSchema);
mongoose.connect("mongodb://localhost/show-stopper");

module.exports = mongoose;
