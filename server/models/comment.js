const mongoose = require("mongoose");
const commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    likedBy: {
        type: mongoose.Schema.Types.ObjectId
        }
});

module.exports = mongoose.model("Comment", commentSchema);