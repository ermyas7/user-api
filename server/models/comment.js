const mongoose = require("mongoose");
const User = require('./user');
const commentSchema = mongoose.Schema({
    text: String,
    postedBy: String,
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId
        }
    ]
});
const Comment = mongoose.model("Comment", commentSchema);

module.exports = {Comment};