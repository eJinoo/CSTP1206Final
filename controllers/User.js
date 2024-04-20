const UserModel = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const RegisterUser = async (req, res) => {
    const userBody = req.body;

    const { email, password, name, userId } = userBody;

    if (!email || !password || !name) {
        return res.status(400).json({
            message: 'Required field missing!'
        });
    }

    try {

        const userExists = await UserModel.findOne({ email });

        if (userExists) {
            return res.status(403).json({
                message: 'User already exists.'
            });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel({
            name,
            email,
            password: encryptedPassword,
            userId
            });

            await newUser.save();
        

        return res.status(201).json({
            message: 'User Registered Successfully!',
            data: newUser
        });
        } 
        catch (error) {
            return res.status(500).json({
                message: 'Error',
                error: error.message
                });
            }
};


const GetUsers = async (req, res) => {

    try {
        const users = await UserModel.find();
        return res.status(200).json({
            message: 'Users Found.',
            data: users
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Fetch error for users!',
            error
        })
    }
}

const LoginUser = async (req, res) => {
    const userBody = req.body;
    
    if (!userBody.email || !userBody.password) {
        return res.status(400).json({
            message: 'Email or Password missing!'
        })
    }

    const userExists = await UserModel.findOne({ email: userBody.email });

    if (!userExists) {
        return res.status(401).json({
            message: "User doesn't exist"
        })
    }

    const isPasswordSame = await bcrypt.compare(userBody.password, userExists.password);

    if (!isPasswordSame) {
        return res.status(401).json({
            message: "Incorrect Password"
        })
    }

    const accessToken = jwt.sign({
        email: userExists.email,
        name: userExists.name,
        id: userExists._id
    }, process.env.JWT_SECRET_KEY);

    const userData = {
        id: userExists._id,
        email: userExists.email,
        name: userExists.name,
        token: accessToken
    }

    return res.status(200).json({
        message: "User Logged in!",
        data: userData
    })

}


module.exports = {
    RegisterUser,
    GetUsers,
    LoginUser
}