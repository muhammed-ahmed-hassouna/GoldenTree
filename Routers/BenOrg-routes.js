const express = require('express');
const router = express.Router()

const OrgController = require('../Controllers/BenOrg-controller');

router.post("/registerBenOrg", OrgController.registerBenOrg);

router.post("/loginBenOrg", OrgController.loginBenOrg);

router.post('/sendEmailBenOrg', OrgController.sendEmailBenOrg);

router.post('/verificationCodeBenOrg', OrgController.verificationCodeBenOrg);

router.put("/updatepasswordBenOrg", OrgController.updatepasswordBenOrg);

router.get("/getBenOrgData", OrgController.getBenOrgData);

router.get('/getBenOrgId/:id', OrgController.getBenOrgId);

router.put('/updateBenOrgData/:id', OrgController.updateBenOrgData);

router.put("/deleteBenOrg/:id", OrgController.deleteBenOrg);

module.exports = router;