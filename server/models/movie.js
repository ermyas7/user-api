const mongoose = require('mongoose');
var MovieSchema = mongoose.Schema(
  {
    Title: String,
    Year: String,
    Type: String,
    Poster: String
    }
    );

const Movie = mongoose.model('Movie', MovieSchema);

module.exports = {Movie};
