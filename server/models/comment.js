const mongoose = require("mongoose");
const User = require('./user');
const commentSchema = mongoose.Schema({
    text: String,
    postedBy: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"}
    ],
    reply: [{
            id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        text: String}]    
});

module.exports = mongoose.model("Comment", commentSchema);