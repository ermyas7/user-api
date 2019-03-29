const express = require('express');
const _ = require('lodash');
const {
    Comment
} = require('../models/comment');
const {
    Movie
} = require('../models/movie');

const router = express.Router({
    mergeParams: true
});

//add new comment
router.post('/movies/:id/comments', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'postedBy'])
    Comment.create(body)
    .then(comment => {
        Movie.findById(id)
        .then(movie => {
            movie.comments.push(comment);
            return movie.save()
        })
        .then(movie => {
            res.send(comment);
        })
    })
    .catch(err => res.send(err)) 
});
   


module.exports = router;