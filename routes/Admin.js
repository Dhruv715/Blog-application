const express = require('express');
const { AddAdmin, LoginAdmin, FetchAllBlog, FetchBlogsUserWise, FetchBlogsByStatus, deleteBlogByAdmin, deleteUserByAdmin } = require('../controller/Admin');
const router = express.Router();

// Add Admin
router.post('/Signup',AddAdmin);

// Login Admin
router.post('/Login',LoginAdmin);

// View All Blog
router.get('/ViewAllBlog',FetchAllBlog);

// View All Blogs UserWise
router.get('/FetchBlogsUserWise/:userId',FetchBlogsUserWise);

// View Blogs Status Wise
router.get('/FetchBlogsByStatus/:status',FetchBlogsByStatus);

// Delete Blog By Admin
router.delete('/deleteBlogByAdmin/:id',deleteBlogByAdmin);

// Delete Manage User By Admin
router.delete('/deleteUserByAdmin/:id',deleteUserByAdmin);

module.exports  = router;