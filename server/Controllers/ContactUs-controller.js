const express = require("express");
const app = express();
app.use(express.json());
const nodemailer = require('nodemailer');
var cors = require('cors');
app.use(cors());

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mohammedhassouna000@gmail.com',
        pass: 'iyfyzqcsphpdwgvz',
    },
    auth: {
        user: 'psmohammad780@gmail.com',
        pass: 'lpvkrxpgamkzlwzl',
    },
});

const sendMessageEmail = async (fullname, email, message, subject) => {
    const mailOptions = {
        from: email,
        to: 'mohammedhassouna000@gmail.com',
        // to: email,
        subject: subject,
        html: `<p><strong>fullname:</strong> ${fullname}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
    };
    // console.log(email);
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};


const sendEmailContact = async (req, res) => {
    try {

        const fullname = req.body.name;
        const email = req.body.email;
        const message = req.body.message;
        const subject = req.body.subject;

        await sendMessageEmail(fullname, email, message, subject);

        res.status(200).json({ message: 'Email has been sent.' });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'An error occurred while sending the email.' });
    }
};



module.exports = {
    sendEmailContact
}