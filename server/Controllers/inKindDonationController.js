//inKindDonationController.js
const InKindDonation = require("../Models/inKindDonationModel");
const IndividualDonor = require("../Models/DonorsUserSchema");
const OrganizationalDonor = require('../Models/DonorsOrgSchema');
const Joi = require('joi');

const path = require("path")
const multer = require("multer")


// Storage Image By Multer Start
let lastFileSequence = 0;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'InKindDonationsImages');
  },
  filename: (req, file, cb) => {
    lastFileSequence++;
    const newFileName = `${Date.now()}_${lastFileSequence}${path.extname(file.originalname)}`;
    cb(null, newFileName);
  },
});

const addImage = multer({ storage: storage });
const imageActivity = addImage.single('image');



// controllers/inKindDonationController.js

// ...

const getAllInKindDonations = async (req, res) => {
  try {
    const { search, donorType, itemType } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: new RegExp(search, 'i') } },
        { description: { $regex: new RegExp(search, 'i') } },
      ];
    }

    if (donorType) {
      query.donor_type = donorType;
    }

    if (itemType) {
      query.item_type = itemType;
    }

    const inKindDonations = await InKindDonation.find(query);

    // Map donations with images
    const inKindDonationsWithImages = inKindDonations.map((donation) => ({
      ...donation.toJSON(),
      image_url: `http://localhost:5000/InKindDonationsImages/${donation.image}`,
    }));

    res.render('donations', { donations: inKindDonationsWithImages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getDonationsByDonorId = async (req, res) => {
  const { id } = req.params;

  try {
    console.log("Donor ID:", id);

    // Find all donations associated with the donor_id
    const donations = await InKindDonation.find({ donor_id: id });

    console.log("Found Donations:", donations);

    // Check if any donations were found
    if (donations.length === 0) {
      return res.status(404).json({ error: "No donations found for the donor" });
    }

    // Return the list of donations
    res.json(donations);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getInKindDonationById = async (req, res) => {
  const { donationId } = req.params;
  try {
    const donation = await InKindDonation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ error: "In-kind donation not found" });
    }
    res.json(donation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const validItemTypes = [
  "Tree Planting Kit",
  "Irrigation Tools",
  "Plant Care Essentials",
  "Portable Planting Boxes",
  "Native Tree Seeds",
  "Plants",
];

const donationSchema = Joi.object({
  title: Joi.string().required(),
  item_type: Joi.string().valid(...validItemTypes).required(),
  description: Joi.string().required(),
  // Add other validations as needed
});



const createInKindDonation = async (req, res) => {
  const { title, item_type, description } = req.body;
  const { id } = req.params;
  const image = req.file.filename;

  // Validate request data
  const { error } = donationSchema.validate({ title, item_type, description });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const individualDonor = await IndividualDonor.findOne({
      _id: id,
    });

    const organizationDonor = await OrganizationalDonor.findOne({
      _id: id,
    });

    if (!individualDonor && !organizationDonor) {
      return res.status(404).json({ error: "Donor not found" });
    }

    if (individualDonor && individualDonor.role) {
      const newDonation = new InKindDonation({
        donor_id: id,
        donor_type: individualDonor.role,
        title,
        item_type,
        description,
        image,
      });

      const savedDonation = await newDonation.save();
      return res.status(201).json(savedDonation);
    } else if (organizationDonor && organizationDonor.role) {
      const newDonation = new InKindDonation({
        donor_id: id,
        donor_type: organizationDonor.role,
        title,
        item_type,
        description,
        image,
      });

      const savedDonation = await newDonation.save();
      return res.status(201).json(savedDonation);
    }

    return res.status(404).json({ error: "Donor's role is null" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const renderDonationForm = (req, res) => {
  const { id } = req.params;
  res.render('createDonations', { donorId: id });
};

module.exports = {
  getAllInKindDonations,
  getInKindDonationById,
  createInKindDonation,
  getDonationsByDonorId,
  imageActivity,
  
  renderDonationForm, 
  // Add other controller methods as needed
};


