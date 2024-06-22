const Blog = require('../model/Blog');
const Category = require('../model/Category');
const User = require('../model/User');
const jwt = require('jsonwebtoken');

exports.addBlog = async (req, res) => {
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
      decoded = jwt.verify(token, 'token');
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

    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(404).json({
        status: 'Failed',
        message: 'Category not found',
      });
    }

    if (req.file) {
      req.body.image = req.file.originalname;
    }

    const blogData = new Blog({
      title: req.body.title,
      image: req.body.image,
      content: req.body.content,
      author: user._id,
      category: category._id
    });

    const savedBlog = await blogData.save();

    res.status(201).json({
      status: 'Success',
      message: 'Blog created successfully',
      blog: savedBlog
    });

  } catch (error) {
    res.status(500).json({
      status: 'Failed',
      message: 'Error occurred',
      error: error.message
    });
  }
};

// Update Blog
exports.updateBlog = async (req, res) => {
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
        decoded = jwt.verify(token, 'token');
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
  
      if (req.file) {
        req.body.image = req.file.originalname;
      }
  
      const updatedData = {
        title: req.body.title,
        image: req.body.image,
        content: req.body.content,
        category: req.body.category
      };
  
      const updatedBlog = await Blog.findByIdAndUpdate(blogId, updatedData, {
        new: true,
        runValidators: true,
      });
  
      res.status(200).json({
        status: 'Success',
        message: 'Blog updated successfully',
        blog: updatedBlog
      });
  
    } catch (error) {
      res.status(500).json({
        status: 'Failed',
        message: 'Error occurred',
        error: error.message
      });
    }
  };
  

// Delete Blog
exports.deleteBlog = async (req, res) => {
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
        decoded = jwt.verify(token, 'token');
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
  
      await Blog.findByIdAndDelete(blogId);
  
      res.status(200).json({
        status: 'Success',
        message: 'Blog deleted successfully',
      });
  
    } catch (error) {
      res.status(500).json({
        status: 'Failed',
        message: 'Error occurred',
        error: error.message
      });
    }
  };
  
// Like a blog post
exports.likeBlog = async (req, res) => {
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
        decoded = jwt.verify(token, 'token');
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
  
      if (blog.likes.includes(user._id)) {
        return res.status(400).json({
          status: 'Failed',
          message: 'User has already liked this blog'
        });
      }
  
      blog.likes.push(user._id);
      await blog.save();
  
      res.status(200).json({
        status: 'Success',
        message: 'Blog liked successfully',
        blog
      });
  
    } catch (error) {
      res.status(500).json({
        status: 'Failed',
        message: 'Error occurred',
        error: error.message
      });
    }
  };

//   Toggle Like
exports.toggleLikeBlog = async (req, res) => {
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
        decoded = jwt.verify(token, 'token'); 
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
  
      const userIndex = blog.likes.indexOf(user._id);
  
      if (userIndex === -1) {
        // User has not liked this blog, so add the like
        blog.likes.push(user._id);
        await blog.save();
        res.status(200).json({
          status: 'Success',
          message: 'Blog liked successfully',
          blog
        });
      } else {
        // User has already liked this blog, so remove the like
        blog.likes.splice(userIndex, 1);
        await blog.save();
        res.status(200).json({
          status: 'Success',
          message: 'Blog unliked successfully',
          blog
        });
      }
  
    } catch (error) {
      res.status(500).json({
        status: 'Failed',
        message: 'Error occurred',
        error: error.message
      });
    }
  };
  