const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: String,
    content: String,
    authorId: mongoose.Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

exports.createPost = function createPost({ title, content, user }, cb) {
    const postInfo = {
        title,
        content,
        authorId: user._id
    };

    const post = new Post(postInfo);
    post.save(cb);
};
