const _ = require('lodash');
const mongoose = require('mongoose');
const {Movie} = require('./models/movie');

const data = require('./movies.json');

const seedMovie = () => {
	data.forEach((movie) => {
		let body = _.pick(movie, ['Title', 'Year', 'Poster', 'Type']);
		Movie.create(body, (err, data) => {
			if(err){
				console.log(err)
			}
		})
	})
}


module.exports = {seedMovie};
