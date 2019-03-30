require('./config/config')
const _ = require('lodash')
const mongoose = require('./db/mongoose')
const express = require('express')
const bodyParser = require('body-parser')

const {
  authenticate
} = require('./middleware/authenticate');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const commentsRouter = require('./routes/comments');
const PORT = process.env.PORT;

const {
  seedMovie
} = require('./seed');

seedMovie();
const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => res.send("hello world!"));

//add  routers to app
app.use("/", usersRouter);
app.use("/", moviesRouter);
app.use("/", commentsRouter);

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
