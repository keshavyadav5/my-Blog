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
      comment.numberOfLikes += 1;
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

const editComment = async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId)
  if (!comment) return res.status(404).json({ message: "Comment not found" })

  if (comment.userId !== req.user.id && !req.user.isAdmin) {
    return res.status(401).json({ message: "You are not authorized to edit this comment" })
  }
  const editComment = await Comment.findByIdAndUpdate(req.params.commentId, {
    content: req.body.content
  }, {
    new: true
  })
  res.status(200).json(editComment)
}

module.exports = {
  createComment,
  getComment,
  likeComment,
  editComment
}