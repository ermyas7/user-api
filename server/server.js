require('./config/config')
const _ = require('lodash')
const mongoose = require('./db/mongoose')
const express = require('express')
const bodyParser = require('body-parser')

var {User}   = require('./models/user');
var {Movie} = require('./models/movie');
var {authenticate} = require('./middleware/authenticate');
const PORT = process.env.PORT;

const {seedMovie} = require('./seed');

seedMovie();

const app = express();

app.use(bodyParser.json());


app.get('/', (req,res) => res.send("hello world!"));

/////////////////////////
//register user
////////////////////////

app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email','username','password'])
  var user = new User(body);
  user.save()
  .then(() => {
    return user.generateAuthToken();
  })
  .then((token) => {
    res.header('x-auth',token).send({user})
  })
  .catch(err => {
    res.status(400).send({error: err.message})
  })
})

  //////////////////////////////////////////////
  ///////////////login user route  ////////////
  ////////////////////////////////////////////

  app.post('/users/login', (req, res) => {

    //pick password and email from request data
    var body = _.pick(req.body, ['email', 'password'])

    //authenticate the given user using credentials
    User.findByCredentials(body.email, body.password)
    .then(user => {
       return user.generateAuthToken()
       .then((token) => {
         res.header('x-auth',token).send({user})
       })
    })
    .catch(err => {
      res.status(400).send({error: err})
    })
  })

  //////////////////////////////////////////////
  ///////////////logout user route  ////////////
  ////////////////////////////////////////////

  app.delete('/users/me/token',authenticate, (req, res) => {
    req.user.removeToken(req.token)
    .then(() =>{
      res.status(200).send();
    }, () => {
      res.status(400).send()
    })
  })



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

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
