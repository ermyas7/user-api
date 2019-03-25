const mongoose = require('mongoose');
const _ = require('lodash');

var MovieSchema = mongoose.Schema(
  {
    Title: String,
    Year: String,
    Type: String,
    Poster: String
    }
    );



MovieSchema.methods.toJSON = function(){
  var movie = this;
  var movieObject = movie.toObject();
  return _.pick(movieObject, ['_id', 'Title', 'Year', 'Poster', 'Type'])

}

const Movie = mongoose.model('Movie', MovieSchema);

module.exports = {Movie};
