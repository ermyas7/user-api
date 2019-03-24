const mongoose = require('mongoose');
//set mongoose to return a global Promise
mongoose.Promise = global.Promise
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, {useNewUrlParser: true}).then(function(){
    //connected successfully
}, function(err) {
    //err handle
    console.log(err)
});
