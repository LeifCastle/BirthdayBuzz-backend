const mongoose = require('mongoose');

// the subdocuments get created first - embedded document
const commentSchema = new mongoose.Schema({
    username: String,
    header: String,
    body: String
}, { timestamps: true });

const postSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    content: String,
    username: String,
    comments: [commentSchema]
}, { timestamps: true });

// create model
const Post = mongoose.model('Post', postSchema);

module.exports = Post;