const passport = require('passport');
const UserModel = require("../Models/DonorsUserSchema"); // Adjust the path accordingly
const jwt = require("jsonwebtoken");
require('../Middleware/auth');

const isLoggedIn = (req, res, next) => {
    req.user ? next() : res.sendStatus(401);
};

const button = (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
};

const authentication = passport.authenticate("google", {
    scope: ["email", "profile"],
});

const authenticationCallback = passport.authenticate("google", {
    successRedirect: "http://localhost:5000",
    failureRedirect: "/auth/google/failure",
});

const protected = (isLoggedIn, async (req, res) => {
    try {
        const userEmail = req.user && req.user.emails && req.user.emails[0] && req.user.emails[0].value;
        const userId = req.user.id;
        const displayName = req.user.displayName;
        const [firstName, lastName] = displayName.split(' ');

        // Query the database to check if the email from Google already exists
        const existingUser = await UserModel.findOne({ email: userEmail });

        if (existingUser) {
            const payload = {
                firstName: firstName,
                lastName: lastName,
                email: userEmail,
                user_id: userId,
                role: existingUser.role
            };

            const secretKey = process.env.SECRET_KEY;
            const token = jwt.sign(payload, secretKey, { expiresIn: "7d" });
            res.status(200).json({
                message: "User added successfully",
                token: token
            });
        } else {
            // Email doesn't exist in the database
            // const role_id = 1;
            const password = 'No Access';

            const newUser = new UserModel({
                firstName: firstName,
                lastName: lastName,
                email: userEmail,
                password: password,
            });

            await newUser.save();

            const payload = {
                firstName: firstName,
                lastName: lastName,
                email: userEmail,
                user_id: userId,
                role: role
            };

            const secretKey = process.env.SECRET_KEY;
            const token = jwt.sign(payload, secretKey, { expiresIn: "7d" });
            res.status(200).json({
                message: "User added successfully",
                token: token
            });
        }
    } catch (error) {
        console.error("Error in protected route:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
});

const logout = (req, res) => {
    req.logout(() => {
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
            }
            res.send("Goodbye!");
        });
    });
};

const authenticationFailure = (req, res) => {
    res.send('Failed to authenticate..');
};

module.exports = {
    button,
    authentication,
    authenticationCallback,
    protected,
    logout,
    authenticationFailure
};
