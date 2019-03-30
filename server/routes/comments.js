const express = require('express');
const _ = require('lodash');
const {ObjectID} = require('mongodb');
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
   
//get comments for the list
router.get('/movies/:id/comments', (req, res) => {
    let id = req.params.id;
    Movie.findById(id)
         .populate('comments')
         .exec((err, movie) => {
             if(err){
                 res.send(err)
             }
             res.send(movie.comments)
         })   
}) 


//add like 
router.post('/movies/:id/comments/:comId/likes', (req, res) => {
    let id = req.params.id;
    let comId = req.params.comId;
    let likedBy = req.body.liked;
    Comment.findById(comId)
    .then(comment => {
        comment.likes.push(likedBy);
        return comment.save()
    })
    .then(comment => {
        Movie.findById(id)
        .then(movie => {
            movie.comments.push(comment)
           return movie.save()
        }) 
        .then(movie => res.send(comment))       
    })
    .catch(err => res.send(err))
    })

//get likes
router.get('/movies/:id/comments/:comId/likes', (req, res) => {
    let comId = req.params.comId;
    Comment.findById(comId)
    .then(comment => {
        res.send(comment.likes)
    })
    .catch(err => res.send(err))
})
module.exports = router;