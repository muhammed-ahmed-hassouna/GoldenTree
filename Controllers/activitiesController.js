const Activities = require("../Models/Activities")
const mongoose = require("mongoose")
const path = require("path")
const multer = require("multer")

// Storage Image By Multer Start
let lastFileSequence = 0;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'ActivitiesImages');
  },
  filename: (req, file, cb) => {
    lastFileSequence++;
    const newFileName = `${Date.now()}_${lastFileSequence}${path.extname(file.originalname)}`;
    cb(null, newFileName);
  },
});

const addImage = multer({ storage: storage });
const imageActivity = addImage.single('image');

//! Get All Activities 
const getAllActivities = async (req, res) => {
  try {

    const activities = await Activities.find({
    isDeleted: false }
    )
    
    const activitiesWithImages = activities.map((activity) => ({
      ...activity.toJSON(),
      image_url: `http://localhost:5000/ActivitiesImages/${activity.activitiesImageName}`,
    }))
    
    res.status(200).json({
      success: true,
      message: "Activities returned Successfully",
      Activities: activitiesWithImages
    })
  
  } catch(error) {
    console.error("Error Occurred While Get Activities", error)
    res.status(500).json({
      success: false,
      message: "Error Occurred While Get Activities",
      error: error.message
    })
  }
}

//! Get Activities By Id
const getActivityById = async (req, res) => {
  try {

    const id = req.params.id;
    const existingActivity = await Activities.findById(id)

    if(!existingActivity) {
      return res.status(404).json({
        success: false,
        message: "Activity Not Found",
      })
    }

    image_url = `http://localhost:5000/ActivitiesImages/${existingActivity.activitiesImageName}`,
    existingActivity.activitiesImageName = image_url
    res.status(200).json({
      success: true,
      message: "Activity returned successfully",
      Activity: existingActivity
    })
  } catch (error) {
    console.error("Error Occurred While Feth Activity: ", error)
    res.status(500).json({
      success: false,
      message: "Error Occurred While Feth Activity",
      error: error.message
    })
  }
}

//! Get Activities By Donor Id
const getActivityByDonorId = async (req, res) => {
  try {

    const id = req.user._id;
    const Activities = await Activities.find({ Donor: id, isDeleted: false });

    const activitiesWithImages = Activities.map((activity) => ({
      ...activity.toJSON(),
      image_url: `http://localhost:5000/ActivitiesImages/${activity.activitiesImageName}`,
    }))

    res.status(200).json(activitiesWithImages);

  } catch (error) {
    console.error("Error Occurred While Feth Activity: ", error)
    res.status(500).json({
      success: false,
      message: "Error Occurred While Feth Activity",
      error: error.message
    })
  }
}

//! Get Activities By Organization Id
const getActivityByOrganizationId = async (req, res) => {
  try {

    const id = req.user._id;
    const Activities = await Activities.find({ organization: id, isDeleted: false });

    const activitiesWithImages = Activities.map((activity) => ({
      ...activity.toJSON(),
      image_url: `http://localhost:5000/ActivitiesImages/${activity.activitiesImageName}`,
    }))

    res.status(200).json(activitiesWithImages);

  } catch (error) {
    console.error("Error Occurred While Feth Activity: ", error)
    res.status(500).json({
      success: false,
      message: "Error Occurred While Feth Activity",
      error: error.message
    })
  }
}

//! Add New Activity 
const addNewActivity = async(req, res) => {
  try {

    const { activityName, activityDescription, activityDate } = req.body;
    const activitiesImageName = req.file.filename;

    //! Add New Activity
    const newActivity = new Activities({
      activityName,
      activityDescription,
      activityDate,
      activitiesImageName,
    })

    //! Save Activity 
    const saveActivity =  await newActivity.save()

    res.status(200).json({
      success: true,
      message: "Activity added successfully",
      Activity: saveActivity
    })
  } catch(error) {
    console.error("An error occurred while adding the Activity", error)
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the Activity",
      error: error.message
    })
  }
}

//! Update Activity
const updateActivityById = async (req, res) => {
  try {
    const id = req.params.id   
    const { activityName, activityDescription, activityDate } = req.body
    const activitiesImageName = req.file.filename;

    const updateActivity = await Activities.findByIdAndUpdate(
      id,
      {
      activityName,
      activityDescription,
      activityDate,
      activitiesImageName },
      { new: true }
    )

    if(!updateActivity) {
      return res.status(404).json({
        success: false,
        message: "Activity Not Found"
      })
    }

    res.status(200).json({
      success: true,
      message: "Activity Updated Successfully",
      Activity: updateActivity
    })

  } catch(error) {
    console.error("Error While Updating Activity")
    res.status(500).json({
      success: false,
      message: "An error Occurred While Updating Activity",
      error: error.message
    })
  }
}

//! Soft Delete Activity
const deleteActivityById = async(req, res) => {
  try {

    const id = req.params.id;
    const deleteActivity = await Activities.findByIdAndUpdate(
      id,
      {
        isDeleted: true
      },
      { new: true }
    )

    if(!deleteActivity) {
      return res.status(404).json({
        success: false,
        message: "Activity Not Found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Activity Deleted Successfully",
    })

  } catch(error) {
    console.error("An Error Occurred While Delete Activity", error)
    res.status(500).json({
      success: false,
      message: "An Error Occurred While Delete Activity",
      error: error.message
    })
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByDonorId,
  getActivityByOrganizationId,
  addNewActivity,
  imageActivity,
  updateActivityById,
  deleteActivityById
}