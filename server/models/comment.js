const mongoose = require("mongoose");
const uniqueArrayPlugin = require('mongoose-unique-array');
const User = require('./user');
const commentSchema = mongoose.Schema({
    text: String,
    postedBy: String,
    likes: [
        {
            type: String,
            unique: true
        }
    ]
});

commentSchema.plugin(uniqueArrayPlugin);
const Comment = mongoose.model("Comment", commentSchema);

module.exports = {Comment};