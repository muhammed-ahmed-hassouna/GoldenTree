const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const DonOrgMODEL = require('../Models/DonorsOrgSchema');
const nodemailer = require('nodemailer');
dotenv.config();
const multer = require("multer")
// Storage Image By Multer Start
let lastFileSequence = 0;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'UserImage');
  },
  filename: (req, file, cb) => {
    lastFileSequence++;
    const newFileName = `${Date.now()}_${lastFileSequence}${path.extname(file.originalname)}`;
    cb(null, newFileName);
  },
});

const addImage = multer({ storage: storage });
const imageUser = addImage.single('image');

const registerDonOrg = async (req, res) => {
    const { orgName, address, email, password, confirm_password, phoneNumber } = req.body;
    try {
        const schema = Joi.object({
            orgName: Joi.string().min(3).max(25).required(),
            address: Joi.string().min(3).max(25).required(),
            email: Joi.string().email({ minDomainSegments: 2 }).required(),
            password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&!])[A-Za-z\\d@#$%^&!]{8,30}$')).required(),
            confirm_password: Joi.any().equal(Joi.ref('password')).required(),
            phoneNumber: Joi.string().trim().pattern(/^[0-9]{10}$/).message('Phone number must be a 10-digit numeric value').required(),
        });

        const validate = schema.validate({ orgName, address, email, password, confirm_password, phoneNumber });

        if (validate.error) {
            return res.status(400).json({ error: validate.error.details });
        }


        const existingUser = await DonOrgMODEL.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new DonOrgMODEL({
            orgName,
            address,
            email,
            password: hashedPassword,
            phoneNumber
        });

        await newUser.save();

        const payload = {
            orgName,
            email,
            user_id: newUser._id,
            role:"DonOrg"

        };

        const secretKey = process.env.SECRET_KEY;
        const token = jwt.sign(payload, secretKey, { expiresIn: "7d" });

        res.status(200).send({
            validate,
            message: "User added successfully",
            token,
            redirect: '/'
        });
        // res.redirect('http://localhost:5000');

    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to add");
    }
};

const loginDonOrg = async (req, res) => {
    const { email, password } = req.body;

    try {
        const schema = Joi.object({
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        });

        const validate = schema.validate({ email });
        if (validate.error) {
            res.status(400).json({ error: validate.error.details });
            return;
        }

        const user = await DonOrgMODEL.findOne({ email });

        if (!user) {
            res.status(400).json({ message: 'Email is invalid' });
            return;
        }

        const storedHashedPassword = user.password;

        const passwordMatch = await bcrypt.compare(password, storedHashedPassword);

        if (!passwordMatch) {
            res.status(400).json({ message: 'Password is invalid' });
            return;
        }

        const payload = {
            orgName: user.orgName,
            user_id: user._id,
            email: user.email,
            role:"DonOrg"
        };

        const secretKey = process.env.SECRET_KEY;
        const token = jwt.sign(payload, secretKey, { expiresIn: '7d' });

        res.status(200).json({
            validate,
            message: 'Successfully Login',
            token: token,
            redirect: '/'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to Authenticate');
    }
};

const express = require("express");
const app = express();
app.use(express.json());
var cors = require('cors');
app.use(cors());

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mohammedhassouna000@gmail.com',
        pass: 'iyfyzqcsphpdwgvz',
    },
});

const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendVerificationEmail = async (email, verificationCode) => {
    const mailOptions = {
        from: 'mohammedhassouna000@gmail.com',
        to: email,
        subject: 'Email Verification Code',
        text: `Your email verification code is: ${verificationCode}`,
    };

    console.log('Sending verification email to ' + email);

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email verification');
    }
};

let emailFromSendEmail;
const generatedVerificationCode = generateVerificationCode();

const sendEmailDonOrg = async (req, res) => {
    try {
        const email = req.body.email;
        emailFromSendEmail = email;

        const user = await DonOrgMODEL.findOne({ email: email });
        if (user) {
            user.verificationCode = generatedVerificationCode;//
            await user.save();

            await sendVerificationEmail(email, generatedVerificationCode);
            res.status(200).json({ message: 'Verification code email has been sent.' });
        } else {
            res.status(400).json({ error: 'Email not found in the database.' });
        }
    } catch (error) {
        console.error('Error sending verification email:', error);
        res.status(500).json({ error: 'An error occurred while sending the verification email.' });
    }
};


const verificationCodeDonOrg = async (req, res) => {

    const verificationCode = req.body.verificationCode;

    if (verificationCode === generatedVerificationCode) {
        res.status(200).json({
            message: 'You can go to reset password',
        });
    }
    else {
        res.status(400).json({
            message: "Invalid verification code",
        });
    }
}
const updatepasswordDonOrg = async (req, res) => {
    const newPassword = req.body.newPassword;
    const confirm_password = req.body.confirm_password;
    const email = emailFromSendEmail;

    try {
        const schema = Joi.object({
            newPassword: Joi.string()
                .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&!])[A-Za-z\\d@#$%^&!]{8,12}$'))
                .required(),
            confirm_password: Joi.any().valid(Joi.ref('newPassword')).required(),
        });

        const validate = schema.validate({ newPassword, confirm_password });
        if (validate.error) {
            return res.status(400).json({ error: validate.error.details });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const result = await DonOrgMODEL.findOneAndUpdate(
            { email: email },
            { $set: { password: hashedPassword } },
            { new: true }
        );

        if (result) {
            res.status(200).json({
                message: 'Password updated successfully!',
            });
        } else {
            res.status(400).json({
                error: 'User not found or password not updated',
            });
        }
    } catch (err) {
        console.error('Error updating password:', err);
        res.status(500).json({ error: 'An error occurred while updating the password' });
    }
};

const getDonOrgData = async (req, res) => {
    try {
        const users = await DonOrgMODEL.find({ isDeleted: false });
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};
const getDonOrgId = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await DonOrgMODEL.findOne({ _id: id, isDeleted: false });

        if (!user) {
            return res.status(404).json({ error: "The User not found" });
        } else {
            // res.status(200).json(user);
            res.render("profile", { user });

        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

const updateDonOrgData = async (req, res) => {
    const { id } = req.params;
    const { orgName, address, email, password, confirm_password, phoneNumber } = req.body;

    try {
        const schema = Joi.object({
            orgName: Joi.string().min(3).max(25).required(),
            address: Joi.string().min(3).max(25).required(),
            email: Joi.string().email({ minDomainSegments: 2 }).required(),
            password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&!])[A-Za-z\\d@#$%^&!]{8,30}$')).required(),
            confirm_password: Joi.any().equal(Joi.ref('password')).required(),
            phoneNumber: Joi.string().trim().pattern(/^[0-9]{10}$/).message('Phone number must be a 10-digit numeric value').required(),
        });

        const validate = schema.validate({ orgName, address, email, password, confirm_password, phoneNumber });


        if (validate.error) {
            return res.status(400).json({ error: validate.error.details });
        }

        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        if (req.file) {
            // If a file is uploaded, set imageName to the filename
            imageName = req.file.filename;
        }
        const updatedUser = await DonOrgMODEL.findByIdAndUpdate(id, {
            $set: {
                orgName,
                address,
                email,
                password: hashedPassword,
                phoneNumber,
                imageName
            }
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: "The User not found" });
        } else {
            res.status(200).json({
                message: 'The User Updated!',
                user: updatedUser,
            });
        }

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

const deleteDonOrg = async (req, res) => {
    const { id } = req.params
    try {
        const deleteUser = await DonOrgMODEL.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        )
        if (!deleteUser) {
            return res.status(404).json({ error: "The User not found" });
        } else {
            res.status(200).json({
                message: 'The User Deleted !',
            });
        }
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    registerDonOrg,
    loginDonOrg,
    sendEmailDonOrg,
    verificationCodeDonOrg,
    updatepasswordDonOrg,
    getDonOrgData,
    getDonOrgId,
    updateDonOrgData,
    deleteDonOrg,
    imageUser
};
