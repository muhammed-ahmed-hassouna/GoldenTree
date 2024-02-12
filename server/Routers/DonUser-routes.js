const express = require('express');
const router = express.Router()

const userController = require('../Controllers/DonUser-controller');

router.post("/registerUser", userController.registerUser);

router.post("/Login", userController.loginUser);

router.post('/sendEmail', userController.sendEmail);

router.post('/verificationCode', userController.verificationCode);

router.put("/updatepassword", userController.updatepassword);

router.get("/getUserData", userController.getUserData);

router.get('/getUserId/:id', userController.getUserId);

router.put('/updateUserData/:id', userController.imageUser, userController.updateUserData, );

router.put("/deleteUser/:id", userController.deleteUser);

module.exports = router;