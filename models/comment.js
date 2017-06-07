'use strict'

let CommentSchema = require('../schemas/comment.js');
let Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;