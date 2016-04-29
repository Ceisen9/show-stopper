var mongoose = require("mongoose");
var bcrypt   = require('bcrypt-nodejs');

var EpisodeSchema = new mongoose.Schema(
  {
    title: String,
  }
);

var ShowSchema = new mongoose.Schema(
  {
    name: String,
    api_id: Number,
    details: {
      image: String,
      url: String,
      premiered: String,
      runtime: Number,
      network: String,
      schedule: String,
      genres: String,
      rating: Number
    },
    episodes: [EpisodeSchema]
  }
);

// define the schema for our user model
var UserSchema = mongoose.Schema({
  facebook         : {
    id           : String,
    token        : String,
    email        : String,
    name         : String
  },
  favoriteShows: [ShowSchema]
});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
//
// // checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the models for episodes, shows, and users and expose it to our app
mongoose.model("Episode", EpisodeSchema);
mongoose.model("Show", ShowSchema);
mongoose.model('User', UserSchema);
mongoose.connect("mongodb://localhost/show-stopper");

module.exports = mongoose;
