const WillAfforested = require("../Models/AreasWillAfforested")
const mongoose = require("mongoose")
const path = require("path")
const multer = require("multer")

// Storage Image By Multer Start
let lastFileSequence = 0;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'AreasWillAfforestedImages');
  },
  filename: (req, file, cb) => {
    lastFileSequence++;
    const newFileName = `${Date.now()}_${lastFileSequence}${path.extname(file.originalname)}`;
    cb(null, newFileName);
  },
});

const addImage = multer({ storage: storage });
const imageWillAfforested = addImage.single('image');

//! Get All Will Afforested Areas 
const getAllWillAfforested = async (req, res) => {
  try {
    const willAfforestedAreas = await WillAfforested.find({ isDeleted: false });

    const willAfforestedAreasWithImages = willAfforestedAreas.map((area) => ({
      ...area.toJSON(),
      image_url: `http://localhost:5000/AreasWillAfforestedImages/${area.willAfforestedAreaImageName}`,
    }));

    res.status(200).json({
      success: true,
      message: "Will Afforested Areas returned Successfully",
      WillAfforestedAreas: willAfforestedAreasWithImages,
    });

  } catch (error) {
    console.error("Error Occurred While Fetching Will Afforested Areas: ", error);
    res.status(500).json({
      success: false,
      message: "Error Occurred While Fetching Will Afforested Areas",
      error: error.message,
    });
  }
};

//! Get Will Afforested Activity By Id
const getWillAfforestedActivityById = async (req, res) => {
  try {
    const id = req.params.id;
    const existingWillAfforestedActivity = await WillAfforested.findById(id);

    if (!existingWillAfforestedActivity) {
      return res.status(404).json({
        success: false,
        message: "Will Afforested Activity Not Found",
      });
    }

    const image_url = `http://localhost:5000/AreasWillAfforestedImages/${existingWillAfforestedActivity.willAfforestedAreaImageName}`;
    existingWillAfforestedActivity.willAfforestedAreaImageName = image_url;

    res.status(200).json({
      success: true,
      message: "Will Afforested Activity returned successfully",
      WillAfforestedActivity: existingWillAfforestedActivity,
    });
  } catch (error) {
    console.error("Error Occurred While Fetching Will Afforested Activity: ", error);
    res.status(500).json({
      success: false,
      message: "Error Occurred While Fetching Will Afforested Activity",
      error: error.message,
    });
  }
};

//! Get Will Afforested Activities By Donor Id
const getWillAfforestedActivitiesByDonorId = async (req, res) => {
  try {
    const donorId = req.user._id;
    const afforestedActivities = await WillAfforested.find({ donor: donorId, isDeleted: false });

    const afforestedActivitiesWithImages = afforestedActivities.map((activity) => ({
      ...activity.toJSON(),
      image_url: `http://localhost:5000/WillAfforestedImages/${activity.willAfforestedAreaImageName}`,
    }));

    res.status(200).json({
      success: true,
      message: "Will Afforested Activities returned Successfully",
      WillAfforestedActivities: afforestedActivitiesWithImages,
    });

  } catch (error) {
    console.error("Error Occurred While Fetching Will Afforested Activities: ", error);
    res.status(500).json({
      success: false,
      message: "Error Occurred While Fetching Will Afforested Activities",
      error: error.message,
    });
  }
};

//! Get Will Afforested Activities By Organization Id
const getWillAfforestedActivitiesByOrganizationId = async (req, res) => {
  try {
    const organizationId = req.user._id;
    const afforestedActivities = await WillAfforested.find({ organization: organizationId, isDeleted: false });

    const afforestedActivitiesWithImages = afforestedActivities.map((activity) => ({
      ...activity.toJSON(),
      image_url: `http://localhost:5000/WillAfforestedImages/${activity.willAfforestedAreaImageName}`,
    }));

    res.status(200).json({
      success: true,
      message: "Will Afforested Activities returned Successfully",
      WillAfforestedActivities: afforestedActivitiesWithImages,
    });

  } catch (error) {
    console.error("Error Occurred While Fetching Will Afforested Activities: ", error);
    res.status(500).json({
      success: false,
      message: "Error Occurred While Fetching Will Afforested Activities",
      error: error.message,
    });
  }
};


//! Add New Will Afforested Activity
const addNewWillAfforestedActivity = async (req, res) => {
  try {
    const { placeName, areasLocation, treesPlanted, datePlanted} = req.body;
    const willAfforestedAreaImageName = req.file.filename;

    //! Add New Will Afforested Activity
    const newWillAfforestedActivity = new WillAfforested({
      placeName,
      areasLocation,
      treesPlanted,
      datePlanted,
      willAfforestedAreaImageName
    });

    //! Save Will Afforested Activity
    const saveWillAfforestedActivity = await newWillAfforestedActivity.save();

    res.status(200).json({
      success: true,
      message: "Will Afforested Activity added successfully",
      WillAfforestedActivity: saveWillAfforestedActivity,
    });
  } catch (error) {
    console.error("An error occurred while adding the Will Afforested Activity", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the Will Afforested Activity",
      error: error.message,
    });
  }
};

//! Update Will Afforested Activity
const updateWillAfforestedActivityById = async (req, res) => {
  try {
    const id = req.params.id;
    const { placeName, areasLocation, treesPlanted, datePlanted,  } = req.body;
    const willAfforestedAreaImageName = req.file.filename;

    const updateWillAfforestedActivity = await WillAfforested.findByIdAndUpdate(
      id,
      {
        placeName,
        areasLocation,
        treesPlanted,
        datePlanted,
        willAfforestedAreaImageName,
      },
      { new: true }
    );

    if (!updateWillAfforestedActivity) {
      return res.status(404).json({
        success: false,
        message: "Will Afforested Activity Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Will Afforested Activity Updated Successfully",
      WillAfforestedActivity: updateWillAfforestedActivity,
    });
  } catch (error) {
    console.error("Error While Updating Will Afforested Activity");
    res.status(500).json({
      success: false,
      message: "An error Occurred While Updating Will Afforested Activity",
      error: error.message,
    });
  }
};

//! Soft Delete Will Afforested Activity
const deleteWillAfforestedActivityById = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteWillAfforestedActivity = await WillAfforested.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!deleteWillAfforestedActivity) {
      return res.status(404).json({
        success: false,
        message: "Will Afforested Activity Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Will Afforested Activity Soft Deleted Successfully",
    });
  } catch (error) {
    console.error("An Error Occurred While Soft Deleting Will Afforested Activity", error);
    res.status(500).json({
      success: false,
      message: "An Error Occurred While Soft Deleting Will Afforested Activity",
      error: error.message,
    });
  }
};


module.exports = {
  imageWillAfforested,
  getAllWillAfforested,
  getWillAfforestedActivityById,
  getWillAfforestedActivitiesByDonorId,
  getWillAfforestedActivitiesByOrganizationId,
  addNewWillAfforestedActivity,
  updateWillAfforestedActivityById,
  deleteWillAfforestedActivityById,
}


