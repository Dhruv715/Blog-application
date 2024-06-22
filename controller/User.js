const User  = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.RegisterUser = async (req, res) => {
    try {
        console.log('Request body:', req.body);

        // Validate request body
        if (!req.body.email || !req.body.password || !req.body.username) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Email, username, and password are required'
            });
        }

        // Check if email already exists
        const Emailcheck = await User.find({ email: req.body.email });
        if (Emailcheck.length > 0) {
            return res.status(409).json({
                status: 'Failed',
                message: 'Email Already Exists'
            });
        }

        // Hash the password
        req.body.password = await bcrypt.hash(req.body.password, 12);
        console.log('Hashed password:', req.body.password);

        // Create new user
        const Data = await User.create(req.body);
        console.log('User created:', Data);

        res.status(201).json({
            status: 'Success',
            message: 'User Registered Successfully',
            data: Data
        });

    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({
            status: 'Failed',
            message: 'Error Occurred',
            error: error.message
        });
    }
};


exports.LoginUser = async (req,res) =>{
    try {
        const { email, password }  = req.body;
        const UserData = await User.findOne({ email });
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