const express = require("express");
const router = express.Router();
const inKindDonationController = require("../Controllers/inKindDonationController");

router.get("/getAllInKindDonations", inKindDonationController.getAllInKindDonations);
router.get("/:donationId", inKindDonationController.getInKindDonationById);
router.post("/createInKindDonation/:id", inKindDonationController.imageActivity, inKindDonationController.createInKindDonation);

router.get('/:id/donations', inKindDonationController.getDonationsByDonorId);


module.exports = router;
