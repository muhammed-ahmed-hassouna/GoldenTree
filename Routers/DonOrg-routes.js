const express = require('express');
const router = express.Router()

const OrgController = require('../Controllers/DonOrg-controller');

router.post("/registerDonOrg", OrgController.registerDonOrg);

router.post("/loginDonOrg", OrgController.loginDonOrg);

router.post('/sendEmailDonOrg', OrgController.sendEmailDonOrg);

router.post('/verificationCodeDonOrg', OrgController.verificationCodeDonOrg);

router.put("/updatepasswordDonOrg", OrgController.updatepasswordDonOrg);

router.get("/getDonOrgData", OrgController.getDonOrgData);

router.get('/getDonOrgId/:id', OrgController.getDonOrgId);

router.put('/updateDonOrgData/:id', OrgController.updateDonOrgData);

router.put("/deleteDonOrg/:id", OrgController.deleteDonOrg);

module.exports = router;