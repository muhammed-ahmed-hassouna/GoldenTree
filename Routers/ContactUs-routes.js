const express = require('express');
const router = express.Router()

const ContactUs = require('../Controllers/ContactUs-controller');



router.post('/sendEmailContact', ContactUs.sendEmailContact);

// router.get("/come", (req, res) => {
//     res.render("contactConfirmation", { submitted: false });
//   });

module.exports = router;