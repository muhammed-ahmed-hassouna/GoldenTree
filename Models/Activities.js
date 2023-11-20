const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommunityActivitiesSchema = new Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor', 
    required: false,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization', 
    required: false,
  },
  activityName: {
    type: String,
    required: true,
  },
  activityDescription: {
    type: String,
    required: true,
  },
  activityDate: {
    type: String, 
    required: true,
  },
  activitiesImageName: {
    type: String,
    allowNull: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const Activities = mongoose.model("Activities", CommunityActivitiesSchema);
module.exports = Activities;
