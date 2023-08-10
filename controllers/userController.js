// Dependencies
const {body, validationResult} = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: __dirname + `/../.env`});

const User = require('../models/user');

// User Authentication
exports.userAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    const jwtSecret = process.env.JWT_SECRET;
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                // 401 Not Authorized
                return res.status(401).json({
                    message: "Not authorized"
                });
            } else {
                next()
            }
        })
    } else {
        // 401 Not Authorized
        return res.status(401).json({
            message: "Not authorized. Token not available", 
        })
    }
};

// Route Controllers

// Home Page
exports.home_page_get = (req, res, next) => {
    res.status(200).json({
        title: "Welcome the home page of the demo task"
    })
}

// User Registration
exports.user_registration_post = [
    // Data Validation & Sanitization
    body("name")
        .trim()
        .isLength({min: 3})
        .withMessage("Name must have at least 3 characters.")
        .escape(),
    body("password")
        .trim()
        .isLength({min: 5})
        .withMessage("Password must have at least 5 characters")
        .escape(),
    body("email")
        .isEmail()
        .withMessage("Wrong email format.")
        .trim()
        .escape(),
    
    // Process request 
    asyncHandler(async (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are erros in response
            // Hide password in response.
            if (errors.array().find(item => item.path === "password")) {
                const index = errors.array().findIndex((obj => obj.path == "password"));
                const count = errors.array()[index].value.length;
                errors.array()[index].value = '*'.repeat(count);
            }

            // JSON Response
            res.status(400).json({
                message: "There are errors in your request",
                errors: errors,
            });
        } else {
            // Check if there is already a user with the same email address.
            const userExists = await User.exists({email: req.body.email}).exec();
            if (userExists){
                // User exists already.
                res.status(400).json({
                    message: "User with the same email address exists already.",
                });
            }
            else  {
                // Hash password
                const password = req.body.password;

                const hash = await bcrypt.hash(password, 10);

                // Create new User
                const user = new User({
                    name: req.body.name,
                    password: hash,
                    email: req.body.email,
                });
                // Save User.
                await user.save();

                // Respond
                res.status(200).json({
                    title: "Your request was successful.",
                    message: "User created. Now you have to login"
                })
            }
        }
    }),
];

// User Login
exports.user_login_post = [
    // Validate data provided
    body("email", "Email must not be empty")
        .isEmail()
        .withMessage("Wrong email format")
        .trim()
        .escape(),
    body("password", "Password must not be empty")
        .trim()
        .escape(),

    // Process Request
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            // There are errors.
            res.status(400).json({
                message: "There are errors in you request.",
                errors: errors.array()
            });
        } else {
            const [email, password ] = [req.body.email, req.body.password];
            // Check if the user exists.
            const user = await User.findOne({ email });

            if (!user) {
                // User doesn't exist
                res.status(400).json({
                    message: "User doesn't exist.",
                });
            } else {
                // User exists

                // Compare given password with hashed password and login.
                const result = await bcrypt.compare(password, user.password);
                if(result) {
                    // JWT Token
                    const jwtSecret = process.env.JWT_SECRET;
                    const maxAge = 3 * 60 * 60;
                    const token = jwt.sign(
                        { id: user._id },
                        jwtSecret,
                        { 
                            expiresIn: maxAge,
                        }
                    )

                    // Create Cookie
                    res.cookie("jwt", token, {
                        httpOnly: true,
                        maxAge: maxAge * 1000,
                    });

                    // Respond
                    res.status(201).json({
                        title: "Login Successful",
                    });
                } else {
                    res.status(400).json({
                        message: "Login not successful. Wrong Password.",
                    })
                }
            }
        }
    })
    
];

// Protected Route
exports.protectedRoute_get = (req, res) => {
    // 200 OK
    res.status(200).json({
        title: "Protected Route",
        message: "User Authorized"
    });
};

// User Logout
exports.user_logout_get = (req, res) => {

    // Check if user is logged in
    if (req.cookies.jwt) {
        res.cookie("jwt", "", { maxAge: "1"});
        res.status(200).json({ message: "Successful Logout"});
    } else {
        res.status(400).json({ message: "You are already logged out"});
    }
};