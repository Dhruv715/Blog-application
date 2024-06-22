const Admin =require('../model/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Blog = require('../model/Blog');
const User  = require('../model/User');

exports.AddAdmin = async (req, res) => {
    try {
        const Emailcheck = await Admin.find({ email: req.body.email });

        if (Emailcheck.length > 0) {
            return res.status(409).json({
                status: 'Failed',
                message: 'Email Already Exists'
            });
        }
        req.body.password = await bcrypt.hash(req.body.password, 12);
        const Data = await Admin.create(req.body);
        
        res.status(201).json({
            status: 'Success',
            message: 'Admin Add Successfully',
            data: Data
        });

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'Error Occurred',
            error: error.message
        });
    }
};

// Login Admin

exports.LoginAdmin = async (req,res) =>{
    try {
        const { email, password }  = req.body;
        const UserData = await Admin.findOne({ email });
        console.log(UserData);
        if(!UserData){
            return res.status(400).json({ msg: 'Email Does Not Exist' });
        }

        const isMatch = await bcrypt.compare(password, UserData.password);
        if (!isMatch) {
          return res.status(400).json({ msg: 'Invalid Password' });
        }
        var token = await jwt.sign(UserData.id,'token');
        res.status(201).json({
            status : 'Success',
            message : 'User Login Successfully',
            token
        });
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'Error Occurred',
            error: error.message
        });
    }
}

exports.FetchAllBlog = async (req,res)=>{
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
    
        const user = await Admin.findById(decoded);
        if (!user) {
          return res.status(403).json({
            status: 'Failed',
            message: 'Unauthorized access',
          });
        }
        
        // const blogs = await Blog.find().populate('author', 'email');
        const blogs = await Blog.find();
        res.status(200).json({
            status: 'Success',
            message: 'Fetched all blogs',
            data: blogs
        });

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'Error Occurred',
            error: error.message
        });
    }
}

exports.FetchBlogsUserWise = async (req, res) => {
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

        const user = await Admin.findById(decoded);
        if (!user) {
            return res.status(403).json({
                status: 'Failed',
                message: 'Unauthorized access',
            });
        }

        const userId = req.params.userId; 
        // const blogs = await Blog.find({ author: userId }).populate('author', 'email');
        const blogs = await Blog.find({ author: userId })
        
        if (!blogs) {
            return res.status(404).json({
                status: 'Failed',
                message: 'No blogs found for the specified user',
            });
        }

        res.status(200).json({
            status: 'Success',
            message: 'Fetched all blogs',
            data: blogs
        });

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'Error Occurred',
            error: error.message
        });
    }
}


exports.FetchBlogsByStatus = async (req, res) => {
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

        const user = await Admin.findById(decoded); 
        if (!user) {
            return res.status(403).json({
                status: 'Failed',
                message: 'Unauthorized access',
            });
        }

        const status = req.params.status; 
        if (!['enable', 'disable'].includes(status)) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Invalid status',
            });
        }

        const blogs = await Blog.find({ status: status });

        if (!blogs.length) {
            return res.status(404).json({
                status: 'Failed',
                message: 'No blogs found for the specified status',
            });
        }

        res.status(200).json({
            status: 'Success',
            message: 'Fetched all blogs',
            data: blogs
        });

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'Error Occurred',
            error: error.message
        });
    }
};



exports.deleteBlogByAdmin = async (req, res) => {
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
  
      const user = await Admin.findById(decoded);
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
  

exports.deleteUserByAdmin = async (req, res) => {
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
  
      const user = await Admin.findById(decoded);
      if (!user) {
        return res.status(403).json({
          status: 'Failed',
          message: 'Unauthorized access',
        });
      }

      const userId = req.params.id;
      const Users = await User.findById(userId);
  
      if (!Users) {
        return res.status(404).json({
          status: 'Failed',
          message: 'User not found',
        });
      }
  
      await User.findByIdAndDelete(userId);
  
      res.status(200).json({
        status: 'Success',
        message: 'User deleted successfully',
      });
  
    } catch (error) {
      res.status(500).json({
        status: 'Failed',
        message: 'Error occurred',
        error: error.message
      });
    }
  };
  