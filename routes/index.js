var express = require('express');
const { RegisterUser, LoginUser } = require('../controller/User');
const { AddCategory, UpdateCategory, DeleteCategory } = require('../controller/Category');
const { addBlog, updateBlog, deleteBlog, likeBlog, toggleLikeBlog } = require('../controller/Blog');
var router = express.Router();
var multer = require('multer');
const { addComment } = require('../controller/Comment');
const { AddAdmin, LoginAdmin, FetchAllBlog, FetchBlogsUserWise, FetchBlogsByStatus, deleteBlogByAdmin, deleteUserByAdmin } = require('../controller/Admin');

const storage = multer.diskStorage({
  destination : function(req,res,cd){
          cd(null , './public/images');
  },
  filename : function (req,file,cd){
      cd(null ,file.originalname);
  }
})

const upload = multer({storage : storage});

// Register User
router.post('/Signup',RegisterUser);

// LoginUser
router.post('/Login',LoginUser);

// Add Category
router.post('/AddCategory',AddCategory);

// Update Category
router.patch('/UpdateCategory/:id',UpdateCategory);

// Delete Category
router.delete('/DeleteCategory/:id',DeleteCategory);

// Add Blog
router.post('/addBlog',upload.single('image'),addBlog);

// Update Blog
router.patch('/updateBlog/:id',upload.single('image'),updateBlog);

// Delete Blog
router.delete('/deleteBlog/:id',deleteBlog);

// Like Features
router.post('/likeBlog/:id',likeBlog);

// Toggle Like Features
router.post('/toggleLikeBlog/:id',toggleLikeBlog);

// Comment on Blog
router.post('/addComment/:id',addComment);

// Add Admin
router.post('/AddNewAdmin',AddAdmin);

// Login Admin
router.post('/LoginAdmin',LoginAdmin);

// View All Blog
router.get('/Admin/ViewAllBlog',FetchAllBlog);

// View All Blogs UserWise
router.get('/Admin/FetchBlogsUserWise/:userId',FetchBlogsUserWise);

// View Blogs Status Wise
router.get('/Admin/FetchBlogsByStatus/:status',FetchBlogsByStatus);

// Delete Blog By Admin
router.delete('/Admin/deleteBlogByAdmin/:id',deleteBlogByAdmin);

// Delete Manage User By Admin
router.delete('/Admin/deleteUserByAdmin/:id',deleteUserByAdmin);

module.exports = router;
