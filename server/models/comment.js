const mongoose = require("mongoose");
const User = require('./user');
const commentSchema = mongoose.Schema({
    text: String,
    postedBy: String,
    likes: [
        {
            type: String,
        }
    ]
});
const Comment = mongoose.model("Comment", commentSchema);

module.exports = {Comment};