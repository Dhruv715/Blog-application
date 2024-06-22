const Category = require('../model/Category');
const User  = require('../model/User');
const jwt = require('jsonwebtoken');

exports.AddCategory = async(req,res)=>{
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
        const users = await User.findById(decoded);
        if (!users) {
            return res.status(403).json({
                status: 'Failed',
                message: 'Unauthorized access',
            });
        }

        if (req.file) {
            req.body.image = req.file.originalname;
        }        
        const CategoryData = await Category.create(req.body);
        
        res.status(201).json({ 
            status : 'Success',
            message: 'Category created successfully',
            CategoryData 
        });
           

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'Error Occurred',
            error: error.message
        });  
    }
}

// Update Category
exports.UpdateCategory = async (req, res) => {
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

        const categoryId = req.params.id;
        if (req.file) {
            req.body.image = req.file.originalname;
        }

        const updatedCategory = await Category.findByIdAndUpdate(categoryId, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedCategory) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Category not found',
            });
        }

        res.status(200).json({
            status: 'Success',
            message: 'Category updated successfully',
            updatedCategory,
        });

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'Error Occurred',
            error: error.message
        });
    }
}

// Delete Category
exports.DeleteCategory = async (req, res) => {
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

        const categoryId = req.params.id;

        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        if (!deletedCategory) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Category not found',
            });
        }

        res.status(200).json({
            status: 'Success',
            message: 'Category deleted successfully',
            deletedCategory,
        });

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'Error Occurred',
            error: error.message
        });
    }
}
