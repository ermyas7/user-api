const express = require('express');
const _ = require('lodash');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

const {
    Movie
} = require('../models/movie');

const router = express.Router({
    mergeParams: true
});


//////////////////////////////////////
////// get all movies ////////////////
/////////////////////////////////////
router.get('/movies', (req, res) => {
    Movie.find({})
        .exec((err, movies) => {
            if(err){
                res.status(400).send(err);
            }
            res.status(200).send(movies)
        })
});


////////////////////////////////
///////// get one movie ////////
//////////////////////////////
router.get('/movies/:id', (req, res) => {
    let id = req.params.id;
    Movie.findById(id)
        .populate('comments')
        .exec((err, movies) => {
            if(err){
                res.status(400).send(err);
            }
            res.status(200).send(movies)
        })
});


///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////cloudinary configuration and multer ////////

var storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});

var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

var upload = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 1000000
    }
})


cloudinary.config({
    cloud_name: 'djinwsqhr',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

router.post('/movies', upload.single('image'), (req, res) => {
    //upload file to cloudinary server
    cloudinary.uploader.upload(req.file.path, (err, result) => {
        if (err) {
            console.log("error from cloudinary")

        }
        // Grab image url
        const Poster = result.secure_url;

        //movie list object
        let body = _.pick(req.body, ['Title', 'Year', 'Type']);
        body = {
            ...body,
            Poster
        };

        //add movie list object to BD
        Movie.create(body)
            .then(movie => res.status(200).send(movie))
            .catch(err => {
                console.log("error from movie");
                res.status(400).send(err)
            });
    });
})

module.exports = router;