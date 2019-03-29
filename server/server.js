require('./config/config')
const _ = require('lodash')
const mongoose = require('./db/mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const cloudinary = require('cloudinary').v2
const multer = require('multer')

const usersRouter = require('./routes/users');
const {
  User
} = require('./models/user');
const {
  Movie
} = require('./models/movie');
const {
  authenticate
} = require('./middleware/authenticate');
const PORT = process.env.PORT;

const {
  seedMovie
} = require('./seed');

//seedMovie();

const app = express();

app.use(bodyParser.json());


app.get('/', (req, res) => res.send("hello world!"));





////////////////////////////////////////////////
///////////////////////////////////////////////
/////// movies route //////////////////////////
//////////////////////////////////////////////
/////////////////////////////////////////////


//////////////////////////////////////
////// get all movies ////////////////
/////////////////////////////////////
app.get('/movies', (req, res) => {
  Movie.find({})
    .then(movies => {
      res.status(200).send(movies)
    })
    .catch(err => {
      res.status(400).send(err)
    })
});


////////////////////////////////
///////// get one movie ////////
//////////////////////////////
app.get('/movies/:id', (req, res) => {
  let id = req.params.id;
  Movie.findById(id)
    .then(movie => {
      res.status(200).send(movie)
    })
    .catch(err => {
      res.status(400).send(err)
    })
});




///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////cloudinary configuration ///////////////////

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

app.post('/movies', upload.single('image'), (req, res) => {
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

//add external routers to app
app.use("/", usersRouter);

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
