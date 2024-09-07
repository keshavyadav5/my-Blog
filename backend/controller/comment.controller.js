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

module.exports = createComment