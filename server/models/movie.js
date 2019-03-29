const mongoose = require('mongoose');
const _ = require('lodash');

const Comment = require('./comment');
const User = require('./user');

var MovieSchema = mongoose.Schema(
  {
    Title: String,
    Year: String,
    Type: String,
    Poster: String,
    comments: [
      {type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"    
      }
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId
      }
    ]
  }
    );



MovieSchema.methods.toJSON = function(){
  var movie = this;
  var movieObject = movie.toObject();
  return _.pick(movieObject, ['_id', 'Title', 'Year', 'Poster', 'Type', 'comments', 'likes'])

}

const Movie = mongoose.model('Movie', MovieSchema);

module.exports = {Movie};
