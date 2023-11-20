const express = require("express");
const router = express.Router();
const donorsController = require("../Controllers/FinancialDonation-controller");

// router.get("/getAllDonors", donorsController.getAllDonors);

router.get("/getDonorById/:id", donorsController.getDonorById);

router.post("/createDonor", donorsController.createDonor);

router.put("/updateDonor/:id", donorsController.updateDonor);

router.delete("/deleteDonor/:id", donorsController.deleteDonor);

router.post("/donate/:id", donorsController.donate);

module.exports = router;
