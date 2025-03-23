import Comment from '../models/comment.model.js';
import User from '../models/user.model.js';

export const getPostComments = async (req, res) => {
  const { postId } = req.params;

  const comments = await Comment.find({ pin: postId })
    .populate('user', 'username img displayName')
    .sort({ createdAt: -1 });

  res.status(200).json(comments);
};

export const addComment = async (req, res) => {
  try {
    const { pin, description } = req.body;
    const userId = req.userId;

    const comment = await Comment.create({
      pin,
      description,
      user: userId,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.log('Error in ADDcOMMENT', error.message);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};
