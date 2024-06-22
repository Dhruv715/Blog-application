const mongoose = require('mongoose');


const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  image : {
        type : String,
        required :false,
        default :null
    },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['enable', 'disable'],
    default: 'enable'
  }
}, {
  timestamps: true 
});


module.exports = mongoose.model('Blog', blogSchema);


