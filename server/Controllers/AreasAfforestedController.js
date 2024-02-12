const Afforested = require("../Models/AreasAfforested")
const mongoose = require("mongoose")
const path = require("path")
const multer = require("multer")

// Storage Image By Multer Start
let lastFileSequence = 0;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'AreasAfforestedImages');
  },
  filename: (req, file, cb) => {
    lastFileSequence++;
    const newFileName = `${Date.now()}_${lastFileSequence}${path.extname(file.originalname)}`;
    cb(null, newFileName);
  },
});

const addImage = multer({ storage: storage });
const imageAfforested = addImage.single('image');

//! Get All Areas Afforested
const getAllAreasAfforested = async (req, res) => {
  try {
    const areasAfforested = await Afforested.find({ isDeleted: false });

    const areasAfforestedWithImages = areasAfforested.map((area) => ({
      ...area.toJSON(),
      image_url: `http://localhost:5000/AreasAfforestedImages/${area.afforestedAreaImageName}`,
    }));

    res.render("home", { AreasAfforested: areasAfforestedWithImages });
  } catch (error) {
    console.error("Error occurred while fetching data:", error);
    // Handle the error and send an appropriate response
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching data",
      error: error.message,
    });
  }
};

//! Get Afforested Activity By Id
const getAfforestedActivityById = async (req, res) => {
  try {
    const id = req.params.id;
    const existingAfforestedActivity = await Afforested.findById(id);

    if (!existingAfforestedActivity) {
      return res.status(404).json({
        success: false,
        message: "Afforested Activity Not Found",
      });
    }

    const image_url = `http://localhost:5000/AreasAfforestedImages/${existingAfforestedActivity.afforestedAreaImageName}`;
    existingAfforestedActivity.afforestedAreaImageName = image_url;

    res.status(200).json({
      success: true,
      message: "Afforested Activity returned successfully",
      AfforestedActivity: existingAfforestedActivity,
    });
  } catch (error) {
    console.error("Error Occurred While Fetching Afforested Activity: ", error);
    res.status(500).json({
      success: false,
      message: "Error Occurred While Fetching Afforested Activity",
      error: error.message,
    });
  }
};

//! Get Afforested Activities By Donor Id
const getAfforestedActivitiesByDonorId = async (req, res) => {
  try {
    const donorId = req.user._id;
    const afforestedActivities = await Afforested.find({ donorId, isDeleted: false });

    const afforestedActivitiesWithImages = afforestedActivities.map((activity) => ({
      ...activity.toJSON(),
      image_url: `http://localhost:5000/AreasAfforestedImages/${activity.afforestedAreaImageName}`,
    }));

    res.status(200).json({
      success: true,
      message: "Afforested Activities returned Successfully",
      AfforestedActivities: afforestedActivitiesWithImages,
    });

  } catch (error) {
    console.error("Error Occurred While Fetching Afforested Activities: ", error);
    res.status(500).json({
      success: false,
      message: "Error Occurred While Fetching Afforested Activities",
      error: error.message,
    });
  }
};

//! Get Afforested Activities By Organization Id
const getAfforestedByOrganizationId = async (req, res) => {
  try {
    const organizationId = req.user._id;
    const afforestedActivities = await Afforested.find({ organizationId, isDeleted: false });

    const afforestedActivitiesWithImages = afforestedActivities.map((activity) => ({
      ...activity.toJSON(),
      image_url: `http://localhost:5000/AreasAfforestedImages/${activity.afforestedAreaImageName}`,
    }));

    res.status(200).json({
      success: true,
      message: "Afforested Activities returned Successfully",
      AfforestedActivities: afforestedActivitiesWithImages,
    });

  } catch (error) {
    console.error("Error Occurred While Fetching Afforested Activities: ", error);
    res.status(500).json({
      success: false,
      message: "Error Occurred While Fetching Afforested Activities",
      error: error.message,
    });
  }
};

//
const addNewAfforestedActivity = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const { placeName, areasLocation, treesPlanted, datePlanted, DonationAmount, Date, maxDonationAmount, expirationTime, descriptionAfforested } = req.body;
    const afforestedAreaImageName = req.file.filename;

    //! Add New Afforested Activity
    const newAfforestedActivity = new Afforested({
      placeName,
      areasLocation,
      treesPlanted,
      datePlanted,
      afforestedAreaImageName,
      DonationAmount,
      Date,
      maxDonationAmount,
      expirationTime,
      descriptionAfforested
    });

    //! Save Afforested Activity
    const saveAfforestedActivity = await newAfforestedActivity.save();

    res.status(200).render('successAddPost');
  } catch (error) {
    console.error("An error occurred while adding the Afforested Activity", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the Afforested Activity",
      error: error.message,
    });
  }
};

//! Update Afforested Activity
const updateAfforestedActivityById = async (req, res) => {
  try {
    const id = req.params.id;
    const { placeName, areasLocation, treesPlanted, datePlanted, views, currentDonationAmount } = req.body;
    // const afforestedAreaImageName = req.file.filename;

    const updateAfforestedActivity = await Afforested.findByIdAndUpdate(
      id,
      {
        placeName,
        areasLocation,
        treesPlanted,
        datePlanted,
        views,
        currentDonationAmount
        // afforestedAreaImageName,
      },
      { new: true }
    );

    if (!updateAfforestedActivity) {
      return res.status(404).json({
        success: false,
        message: "Afforested Activity Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Afforested Activity Updated Successfully",
      AfforestedActivity: updateAfforestedActivity,
    });
  } catch (error) {
    console.error("Error While Updating Afforested Activity");
    res.status(500).json({
      success: false,
      message: "An error Occurred While Updating Afforested Activity",
      error: error.message,
    });
  }
};

//! Soft Delete Afforested Activity
const deleteAfforestedActivityById = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteAfforestedActivity = await Afforested.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!deleteAfforestedActivity) {
      return res.status(404).json({
        success: false,
        message: "Afforested Activity Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Afforested Activity Soft Deleted Successfully",
    });
  } catch (error) {
    console.error("An Error Occurred While Soft Deleting Afforested Activity", error);
    res.status(500).json({
      success: false,
      message: "An Error Occurred While Soft Deleting Afforested Activity",
      error: error.message,
    });
  }
};

const donateAF = async (req, res) => {
  const { id } = req.params;
  try {
    const donation = await Afforested.findById({ _id: id });

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }
    const donationToAdd = req.body.donationAmount;

    if (donation.currentDonationAmount + donationToAdd <= donation.maxDonationAmount) {
      donation.currentDonationAmount += donationToAdd;

      if (donation.currentDonationAmount === donation.maxDonationAmount) {
        donation.expirationTime = new Date(Date.now() + 15 * 1000);
        donation.InWork = true;
        donation.views = false;
      }
      await donation.save();
      setTimeout(async () => {
        if (donation.expirationTime && donation.expirationTime <= new Date()) {
          console.log("Done !");
          donation.isCompleted = true;
          await donation.save();
        }
      }, 15000);

      return res.json({ message: "Donation successful" });
    } else {
      return res.status(400).json({ message: "Maximum donation amount reached" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  getAllAreasAfforested,
  imageAfforested,
  getAfforestedActivityById,
  getAfforestedActivitiesByDonorId,
  getAfforestedByOrganizationId,
  addNewAfforestedActivity,
  updateAfforestedActivityById,
  deleteAfforestedActivityById,
  donateAF
}