const Blog = require('../model/Blog');
const Comment = require('../model/Comment');
const User = require('../model/User');
const jwt = require('jsonwebtoken');

// Add a comment to a blog post
exports.addComment = async (req, res) => {
  try {
    const token = req.headers.auth;

    if (!token) {
      return res.status(401).json({
        status: 'Failed',
        message: 'Authorization token not provided',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, 'token'); // Replace 'your_secret_key' with your actual secret key
    } catch (error) {
      return res.status(401).json({
        status: 'Failed',
        message: 'Invalid token',
        error: error.message
      });
    }

    const user = await User.findById(decoded);
    if (!user) {
      return res.status(403).json({
        status: 'Failed',
        message: 'Unauthorized access',
      });
    }

    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        status: 'Failed',
        message: 'Blog not found',
      });
    }

    const commentData = new Comment({
      content: req.body.content,
      user: user._id,
      blog: blog._id
    });

    const savedComment = await commentData.save();

    res.status(201).json({
      status: 'Success',
      message: 'Comment added successfully',
      comment: savedComment
    });

  } catch (error) {
    res.status(500).json({
      status: 'Failed',
      message: 'Error occurred',
      error: error.message
    });
  }
};
