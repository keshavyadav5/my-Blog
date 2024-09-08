const Comment = require("../models/comment.model");

const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    if (userId !== req.user.id) {
      return res.status(401).json({ message: "You are not authorized to create a comment" })
    }
    const comment = new Comment({ content, postId, userId });
    await comment.save();
    res.status(200).json(comment)
  } catch (error) {
    next(error)
  }
}
const getComment = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 })
    res.status(200).json(comments)
  } catch (error) {
    next(error)
  }
}

const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" })
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes +=1;
      comment.likes.push(req.user.id)
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1)
    }
    await comment.save();
    res.status(200).json(comment)

  } catch (error) {
    next(error)
  }
}

module.exports = {
  createComment,
  getComment,
  likeComment
}